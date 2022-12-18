/**
 * @fileoverview feature sliced relative path checker
 * @author vgratsilev
 */
'use strict';

const path = require('path');

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
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                },
            },
        ],
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

        function isPathRelative(path) {
            return path === '.' || path.startsWith('./') || path.startsWith('../');
        }

        function normalizePath(from) {
            const fromNormalizedPath = path.toNamespacedPath(from);
            const isWindowsOS = fromNormalizedPath.includes('\\');
            const fromPath = fromNormalizedPath.split('src')[1];
            const fromArray = fromPath.split(isWindowsOS ? '\\' : '/'); // [ '', 'entities', 'Article' ]
            const fromLayer = fromArray[1]; // entities
            const fromSlice = fromArray[2]; // Article

            return { fromLayer, fromSlice };
        }

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
            const { fromLayer, fromSlice } = normalizePath(from);

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
                // example: src/entities/Article
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                // example: C:\Users\Vadim\Documents\Github\react-blog\src\entities\Article
                const fromFileName = context.getFilename();

                if (shouldBeRelative(fromFileName, importTo)) {
                    context.report(node, 'Within one slice all paths should be related.');
                }
            },
        };
    },
};
