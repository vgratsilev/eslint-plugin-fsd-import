/**
 * @fileoverview Migrate deprecated FSD layer names in import paths
 */
'use strict';

const { getPathSegments, getSourceLiteral, normalizeSeparators, stripAlias } = require('../helpers/helpers');

const DEPRECATED_LAYER_NAME = 'deprecatedLayerName';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Report deprecated layer names and replace them in import paths.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/no-deprecated-layer-names.md',
        },
        fixable: 'code',
        messages: {
            [DEPRECATED_LAYER_NAME]: 'Layer "{{oldLayer}}" is deprecated; use "{{newLayer}}" instead.',
        },
        schema: [{
            type: 'object',
            properties: {
                alias: { type: 'string', description: 'Alias prefix used for absolute imports.' },
                layersMap: {
                    type: 'object',
                    additionalProperties: { type: 'string' },
                    description: 'Mapping of deprecated layer names to their replacements.',
                },
            },
            additionalProperties: false,
        }],
        defaultOptions: [{ alias: '', layersMap: {} }],
    },

    create(context) {
        const { alias = '', layersMap = {} } = context.options[0] ?? {};
        const sourceCode = context.sourceCode || context.getSourceCode();

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const withoutAlias = stripAlias(value, alias);
                const pathSegments = getPathSegments(withoutAlias);
                const oldLayer = pathSegments?.[0];
                const newLayer = layersMap[oldLayer];

                if (!newLayer) {
                    return;
                }

                context.report({
                    node,
                    messageId: DEPRECATED_LAYER_NAME,
                    data: { oldLayer, newLayer },
                    fix: (fixer) => {
                        const normalizedAlias = normalizeSeparators(alias)?.replace(/\/+$/, '');
                        const aliasPrefix = normalizedAlias && withoutAlias !== value
                            ? `${normalizedAlias}/`
                            : '';
                        const replacement = [newLayer, ...pathSegments.slice(1)].join('/');

                        return fixer.replaceText(
                            node.source,
                            getSourceLiteral(sourceCode, node, `${aliasPrefix}${replacement}`),
                        );
                    },
                });
            },
        };
    },
};
