/**
 * @fileoverview Disallow relative imports that cross FSD slice boundaries
 */
'use strict';

const micromatch = require('micromatch');
const {
    getFilename,
    isPathRelative,
    parseFsdPath,
    resolveRelativeTarget,
} = require('../helpers/helpers');

const CROSS_SLICE_RELATIVE_IMPORT = 'crossSliceRelativeImport';
const defaultLayers = ['entities', 'features', 'pages', 'widgets'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow relative imports between different FSD slices.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/no-cross-slice-relative-imports.md',
        },
        messages: {
            [CROSS_SLICE_RELATIVE_IMPORT]: 'Relative imports must not cross FSD slice boundaries.',
        },
        schema: [{
            type: 'object',
            properties: {
                rootDir: {
                    type: 'string',
                    description: 'Source root directory used to resolve relative imports.',
                },
                layers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Slice-based FSD layers that should reject cross-slice imports.',
                },
                ignoreImportPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Relative import patterns that should skip this rule.',
                },
            },
        }],
        defaultOptions: [{
            rootDir: 'src',
            layers: defaultLayers,
            ignoreImportPatterns: [],
        }],
    },

    create(context) {
        const {
            rootDir = 'src',
            layers = defaultLayers,
            ignoreImportPatterns = [],
        } = context.options[0] ?? {};

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;

                if (!isPathRelative(importPath)
                    || ignoreImportPatterns.some((pattern) => micromatch.isMatch(importPath, pattern))) {
                    return;
                }

                const filename = getFilename(context);
                const current = parseFsdPath(filename, { rootDir, requireRoot: true });
                const targetPath = resolveRelativeTarget(filename, importPath, rootDir);
                const target = parseFsdPath(targetPath);

                if (!current || !target || !layers.includes(current.layer)
                    || current.layer !== target.layer || current.slice === target.slice) {
                    return;
                }

                context.report({ node, messageId: CROSS_SLICE_RELATIVE_IMPORT });
            },
        };
    },
};
