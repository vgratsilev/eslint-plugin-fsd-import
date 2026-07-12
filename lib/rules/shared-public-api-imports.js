/**
 * @fileoverview Restrict shared imports to segment public APIs
 */
'use strict';

const micromatch = require('micromatch');
const {
    getImportPrefix,
    getPathSegments,
    getSourceLiteral,
    isPathRelative,
    normalizeSeparators,
    stripAlias,
    stripRootDir,
} = require('../helpers/helpers');

const SHARED_PUBLIC_API_IMPORT = 'sharedPublicApiImport';
const defaultSegments = ['ui', 'lib', 'api', 'config'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Restrict shared imports to a segment public API.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/shared-public-api-imports.md',
        },
        fixable: 'code',
        messages: {
            [SHARED_PUBLIC_API_IMPORT]: 'Shared imports must use the segment public API.',
        },
        schema: [{
            type: 'object',
            properties: {
                alias: { type: 'string', description: 'Alias prefix used for absolute imports.' },
                rootDir: { type: 'string', description: 'Source root directory used to normalize imports.' },
                segments: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Shared segments that expose public APIs.',
                },
                ignoreImportPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Import patterns that should skip this rule.',
                },
            },
            additionalProperties: false,
        }],
        defaultOptions: [{
            alias: '@',
            rootDir: 'src',
            segments: defaultSegments,
            ignoreImportPatterns: [],
        }],
    },

    create(context) {
        const {
            alias = '@',
            rootDir = 'src',
            segments = defaultSegments,
            ignoreImportPatterns = [],
        } = context.options[0] ?? {};
        const sourceCode = context.sourceCode || context.getSourceCode();
        const ignoreMatchers = ignoreImportPatterns.map(micromatch.matcher);

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const normalizedValue = normalizeSeparators(value);
                const withoutAlias = stripAlias(value, alias);
                const importPath = stripRootDir(withoutAlias, rootDir) || withoutAlias;
                const pathSegments = getPathSegments(importPath);

                if (isPathRelative(value) || !pathSegments || pathSegments[0] !== 'shared'
                    || !segments.includes(pathSegments[1]) || pathSegments.length <= 2
                    || ignoreMatchers.some((matcher) => matcher(normalizedValue)
                        || matcher(importPath))) {
                    return;
                }

                context.report({
                    node,
                    messageId: SHARED_PUBLIC_API_IMPORT,
                    fix: (fixer) => {
                        if (pathSegments.slice(2).some((segment) => segment === '.' || segment === '..')) {
                            return null;
                        }

                        return fixer.replaceText(
                            node.source,
                            getSourceLiteral(
                                sourceCode,
                                node,
                                `${getImportPrefix(value, { alias, rootDir })}shared/${pathSegments[1]}`,
                            ),
                        );
                    },
                });
            },
        };
    },
};
