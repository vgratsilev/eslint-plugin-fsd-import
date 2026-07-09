/**
 * @fileoverview Restrict imports only from layers below
 * @author vgratsilev
 */
'use strict';

const micromatch = require('micromatch');
const { getCurrentFileLayer, getFilename, isPathRelative } = require('../helpers/helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Restrict imports from higher layer into layer below.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/layer-imports.md',
        },
        fixable: null,
        messages: {
            layerImport: 'Current layer can import only layers below: ({{availableLayers}}).',
        },
        schema: [{
            type: 'object',
            description: 'Options for layer import validation.',
            properties: {
                alias: {
                    type: 'string',
                    description: 'Alias prefix used for absolute imports.',
                },
                ignoreImportPatterns: {
                    type: 'array',
                    description: 'Glob patterns for imports that should skip layer validation.',
                },
            },
        }],
        defaultOptions: [{ alias: '', ignoreImportPatterns: [] }],
    },

    create(context) {
        const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

        const layers = {
            'app': ['pages', 'widgets', 'features', 'entities', 'shared'],
            'pages': ['widgets', 'features', 'entities', 'shared'],
            'widgets': ['features', 'entities', 'shared'],
            'features': ['entities', 'shared'],
            'entities': ['entities', 'shared'],
            'shared': ['shared'],
        };

        const availableLayers = {
            'app': 'app',
            'entities': 'entities',
            'features': 'features',
            'pages': 'pages',
            'widgets': 'widgets',
            'shared': 'shared',
        };

        const getImportLayer = (value) => {
            const importPath = alias ? value.replace(`${alias}/`, '') : value;
            const segments = importPath?.split('/');

            return segments?.[0];
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const fromFileName = getFilename(context);
                const currentFileLayer = getCurrentFileLayer(fromFileName);
                const importLayer = getImportLayer(importPath);

                if (isPathRelative(importPath)) {
                    return;
                }

                if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
                    return;
                }

                const isIgnored = ignoreImportPatterns.some((pattern) => {
                    return micromatch.isMatch(importPath, pattern);
                });

                if (isIgnored) {
                    return;
                }

                if (!layers[currentFileLayer]?.includes(importLayer)) {
                    context.report({
                        node,
                        messageId: 'layerImport',
                        data: {
                            availableLayers: layers[currentFileLayer]?.join(', '),
                        },
                    });
                }
            },
        };
    },
};
