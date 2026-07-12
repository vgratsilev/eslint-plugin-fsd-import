/**
 * @fileoverview Restrict imports only from public API
 * @author vgratsilev
 */
'use strict';

const micromatch = require('micromatch');
const {
    getFilename,
    getImportPrefix,
    isPathRelative,
    normalizeSeparators,
    parseFsdPath,
    getSourceLiteral,
} = require('../helpers/helpers');

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Restrict imports only from public API',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/public-api-imports.md',
        },
        fixable: 'code',
        messages: {
            [PUBLIC_ERROR]: 'Absolute import is allowed only from public API (index.ts).',
            [TESTING_PUBLIC_ERROR]: 'Test data should be imported from public API (testing.ts).',
        },
        schema: [
            {
                type: 'object',
                description: 'Options for public API import validation.',
                properties: {
                    alias: {
                        type: 'string',
                        description: 'Alias prefix used for absolute imports.',
                    },
                    rootDir: {
                        type: 'string',
                        description: 'Source root directory used to parse filenames and imports.',
                    },
                    layersOverride: {
                        type: 'array',
                        items: { type: 'string' },
                        description:
                            "Layers that require using public API (default: ['features', 'entities', 'pages', 'widgets'])",
                    },
                    testFilesPatterns: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Glob patterns for files that may import testing public APIs.',
                    },
                },
                additionalProperties: false,
            },
        ],
        defaultOptions: [{ alias: '', rootDir: 'src', layersOverride: [], testFilesPatterns: [] }],
    },

    create(context) {
        const {
            alias = '',
            rootDir = 'src',
            layersOverride,
            testFilesPatterns = [],
        } = context.options[0] ?? {};
        const sourceCode = context.sourceCode || context.getSourceCode();
        const currentFilePath = normalizeSeparators(getFilename(context));
        const testFileMatchers = testFilesPatterns.map(micromatch.matcher);
        const isCurrentFileTesting = currentFilePath
            && testFileMatchers.some((matcher) => matcher(currentFilePath));
        let checkingLayers = {
            'entities': 'entities',
            'features': 'features',
            'pages': 'pages',
            'widgets': 'widgets',
        };

        if (layersOverride?.length) {
            checkingLayers = layersOverride.reduce((accumulator, layerOverride) => {
                if (layerOverride) {
                    accumulator[layerOverride] = layerOverride;
                }

                return accumulator;
            }, {});
        }

        return {
            ImportDeclaration(node) {
                const value = node.source.value;

                if (isPathRelative(value)) {
                    return;
                }

                const importPath = parseFsdPath(value, { alias, rootDir });

                if (!importPath || !checkingLayers[importPath.layer]) {
                    return;
                }

                const isImportNotFromPublicApi = importPath.segments.length > 2;
                const isTestingPublicApi = importPath.segments[2] === 'testing'
                    && importPath.segments.length < 4;

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report({
                        node,
                        messageId: PUBLIC_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node.source,
                                getSourceLiteral(
                                    sourceCode,
                                    node,
                                    `${getImportPrefix(value, { alias, rootDir })}${importPath.layer}/${importPath.slice}`,
                                ),
                            );
                        },
                    });
                }

                if (isTestingPublicApi) {
                    if (!isCurrentFileTesting) {
                        context.report({ node, messageId: TESTING_PUBLIC_ERROR });
                    }
                }
            },
        };
    },
};
