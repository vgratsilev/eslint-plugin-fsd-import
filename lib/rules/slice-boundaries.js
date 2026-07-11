/**
 * @fileoverview Enforce cross-slice public API boundaries
 */
'use strict';

const micromatch = require('micromatch');
const {
    getFilename,
    isPathRelative,
    normalizeSeparators,
    parseFsdPath,
} = require('../helpers/helpers');

const SLICE_BOUNDARY = 'sliceBoundary';
const defaultLayers = ['entities', 'features', 'pages', 'widgets'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow public API imports that cross FSD slice boundaries.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/slice-boundaries.md',
        },
        messages: {
            [SLICE_BOUNDARY]: 'Imports must not cross FSD slice boundaries.',
        },
        schema: [{
            type: 'object',
            properties: {
                alias: { type: 'string', description: 'Alias prefix used for absolute imports.' },
                rootDir: { type: 'string', description: 'Source root directory used to parse paths.' },
                layers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Slice-based FSD layers to check.',
                },
                allowTestingPublicApi: {
                    type: 'boolean',
                    description: 'Whether matching test files may import another slice public API.',
                },
                testFilesPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filename patterns considered test files.',
                },
            },
            additionalProperties: false,
        }],
        defaultOptions: [{
            alias: '@',
            rootDir: 'src',
            layers: defaultLayers,
            allowTestingPublicApi: true,
            testFilesPatterns: [],
        }],
    },

    create(context) {
        const {
            alias = '@',
            rootDir = 'src',
            layers = defaultLayers,
            allowTestingPublicApi = true,
            testFilesPatterns = [],
        } = context.options[0] ?? {};
        const filename = getFilename(context);
        const current = parseFsdPath(filename, { rootDir, requireRoot: true });
        const normalizedFilename = normalizeSeparators(filename);
        const testFileMatchers = testFilesPatterns.map(micromatch.matcher);
        const isAllowedTestingImport = allowTestingPublicApi && normalizedFilename
            && testFileMatchers.some((matcher) => matcher(normalizedFilename));

        return {
            ImportDeclaration(node) {
                const value = node.source.value;

                if (isPathRelative(value)) {
                    return;
                }

                const target = parseFsdPath(value, { alias, rootDir });

                if (!current || !target || target.segments.length !== 2
                    || !layers.includes(current.layer) || current.layer !== target.layer
                    || current.slice === target.slice) {
                    return;
                }

                if (!isAllowedTestingImport) {
                    context.report({ node, messageId: SLICE_BOUNDARY });
                }
            },
        };
    },
};
