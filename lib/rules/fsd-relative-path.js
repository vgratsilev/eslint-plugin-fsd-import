/**
 * @fileoverview Restrict only relative path imports within single slice
 * @author vgratsilev
 */
'use strict';

const path = require('path');
const { getFilename, isPathRelative, normalizePath } = require('../helpers/helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

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
                },
            },
        ],
        defaultOptions: [{ alias: '' }],
    },

    create(context) {
        const alias = context.options[0]?.alias || '';

        const layers = {
            'entities': 'entities',
            'features': 'features',
            'pages': 'pages',
            'shared': 'shared',
            'widgets': 'widgets',
        };

        function shouldBeRelative(from, to) {
            if (isPathRelative(to)) {
                return false;
            }

            // example: entities/Article
            const toArray = to.split('/');
            const toLayer = toArray[0]; // entities
            const toSlice = toArray[1]; // Article

            if (!toLayer || !toSlice || !layers[toLayer]) {
                return false;
            }

            // example: c:\Users\user\project\src\entities\Article
            const projectFrom = normalizePath(from, path);

            const fromArray = projectFrom.split('/');

            const fromLayer = fromArray[1];
            const fromSlice = fromArray[2];

            if (!fromLayer || !fromSlice || !layers[fromLayer]) {
                return false;
            }

            return fromSlice === toSlice && toLayer === fromLayer;
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                try {
                    // example: src/entities/Article
                    const value = node.source.value;
                    const importFrom = alias ? value.replace(`${alias}/`, '') : value; // entities/Article/model/slice/addCommentFormSlice

                    // example: C:\\project\\src\\entities\\Article\\index.ts
                    const fromFileName = getFilename(context);

                    if (shouldBeRelative(fromFileName, importFrom)) {
                        context.report({
                            node,
                            messageId: 'relativePath',
                            fix: (fixer) => {
                                const projectFrom = normalizePath(fromFileName, path); // /entities/Article/index.ts
                                const newPath = projectFrom
                                    .split('/')
                                    .slice(0, -1)
                                    .join('/'); // '/entities/Article'

                                let relativePath = path.relative(newPath, `/${importFrom}`)
                                    .replace(/\\/g, '/');

                                if (!relativePath.startsWith('.')) {
                                    relativePath = './' + relativePath;
                                }

                                return fixer.replaceText(node.source, `'${relativePath}'`);
                            },
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        };
    },
};
