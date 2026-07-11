/**
 * @fileoverview Restrict imports only from public API
 * @author vgratsilev
 */
'use strict';

const micromatch = require('micromatch');
const {
    getFilename,
    isPathRelative,
    normalizeSeparators,
    parseFsdPath,
    stripAlias,
} = require('../helpers/helpers');

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

function hasLeadingPathSegment(value, segment) {
    return value === segment || value.startsWith(`${segment}/`);
}

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
                        description: 'Glob patterns for files that may import testing public APIs.',
                    },
                },
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

        function getImportPrefix(value) {
            const normalizedValue = normalizeSeparators(value);
            const withoutAlias = stripAlias(normalizedValue, alias);
            const normalizedAlias = normalizeSeparators(alias)?.replace(/\/+$/, '');
            const normalizedRootDir = normalizeSeparators(rootDir)?.replace(/^\/+|\/+$/g, '');
            const aliasPrefix = normalizedAlias && withoutAlias !== normalizedValue
                ? `${normalizedAlias}/`
                : '';
            const rootPrefix = normalizedRootDir && hasLeadingPathSegment(withoutAlias, normalizedRootDir)
                ? `${normalizedRootDir}/`
                : '';

            return `${aliasPrefix}${rootPrefix}`;
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
                                `'${getImportPrefix(value)}${importPath.layer}/${importPath.slice}'`,
                            );
                        },
                    });
                }

                if (isTestingPublicApi) {
                    const currentFilePath = normalizeSeparators(getFilename(context));
                    const isCurrentFileTesting = currentFilePath && testFilesPatterns.some(
                        (pattern) => micromatch.isMatch(currentFilePath, pattern),
                    );

                    if (!isCurrentFileTesting) {
                        context.report({ node, messageId: TESTING_PUBLIC_ERROR });
                    }
                }
            },
        };
    },
};
