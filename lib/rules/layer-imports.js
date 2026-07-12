/**
 * @fileoverview Restrict imports only from layers below
 * @author vgratsilev
 */
'use strict';

const micromatch = require('micromatch');
const { getFilename, isPathRelative, parseFsdPath } = require('../helpers/helpers');

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
                rootDir: {
                    type: 'string',
                    description: 'Source root directory used to parse filenames and imports.',
                },
                ignoreImportPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Glob patterns for imports that should skip layer validation.',
                },
            },
            additionalProperties: false,
        }],
        defaultOptions: [{ alias: '', rootDir: 'src', ignoreImportPatterns: [] }],
    },

    create(context) {
        const { alias = '', rootDir = 'src', ignoreImportPatterns = [] } = context.options[0] ?? {};
        const currentFileLayer = parseFsdPath(getFilename(context), {
            rootDir,
            requireRoot: true,
        })?.layer;
        const ignoreMatchers = ignoreImportPatterns.map(micromatch.matcher);

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;

                if (isPathRelative(importPath)) {
                    return;
                }

                const importLayer = parseFsdPath(importPath, { alias, rootDir })?.layer;

                if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
                    return;
                }

                const isIgnored = ignoreMatchers.some((matcher) => matcher(importPath));

                if (isIgnored || layers[currentFileLayer].includes(importLayer)) {
                    return;
                }

                context.report({
                    node,
                    messageId: 'layerImport',
                    data: {
                        availableLayers: layers[currentFileLayer].join(', '),
                    },
                });
            },
        };
    },
};
