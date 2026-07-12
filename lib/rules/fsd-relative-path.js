/**
 * @fileoverview Restrict only relative path imports within single slice
 * @author vgratsilev
 */
'use strict';

const path = require('path');
const {
    extractPathFromRoot,
    getFilename,
    getSourceLiteral,
    isPathRelative,
    parseFsdPath,
} = require('../helpers/helpers');

const layers = {
    'entities': 'entities',
    'features': 'features',
    'pages': 'pages',
    'shared': 'shared',
    'widgets': 'widgets',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'feature sliced relative path checker',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/fsd-relative-path.md',
        },
        fixable: 'code',
        messages: {
            relativePath: 'Within one slice all paths should be related.',
        },
        schema: [
            {
                type: 'object',
                description: 'Options for resolving FSD import aliases.',
                properties: {
                    alias: {
                        type: 'string',
                        description: 'Alias prefix used for absolute imports.',
                    },
                    rootDir: {
                        type: 'string',
                        description: 'Source root directory used to parse filenames and imports.',
                    },
                },
                additionalProperties: false,
            },
        ],
        defaultOptions: [{ alias: '', rootDir: 'src' }],
    },

    create(context) {
        const { alias = '', rootDir = 'src' } = context.options[0] ?? {};
        const sourceCode = context.sourceCode || context.getSourceCode();
        const filename = getFilename(context);
        const current = parseFsdPath(filename, { rootDir, requireRoot: true });

        function getSameSliceImport(importPath) {
            if (isPathRelative(importPath)) {
                return null;
            }

            const target = parseFsdPath(importPath, { alias, rootDir });

            if (!target || !current || !layers[target.layer] || !layers[current.layer]) {
                return null;
            }

            return target.layer === current.layer && target.slice === current.slice
                ? target
                : null;
        }

        function getRelativeImportPath(filename, targetPath) {
            const currentPath = extractPathFromRoot(filename, rootDir);

            if (!currentPath) {
                return null;
            }

            const pathApi = filename.includes('\\') ? path.win32 : path.posix;
            let relativePath = pathApi.relative(pathApi.dirname(currentPath), targetPath)
                .replace(/\\/g, '/');

            if (!relativePath.startsWith('.')) {
                relativePath = `./${relativePath}`;
            }

            return relativePath;
        }

        return {
            ImportDeclaration(node) {
                const target = getSameSliceImport(node.source.value);

                if (!target) {
                    return;
                }

                context.report({
                    node,
                    messageId: 'relativePath',
                    fix: (fixer) => {
                        const relativePath = getRelativeImportPath(filename, target.path);

                        return relativePath
                            ? fixer.replaceText(node.source, getSourceLiteral(sourceCode, node, relativePath))
                            : null;
                    },
                });
            },
        };
    },
};
