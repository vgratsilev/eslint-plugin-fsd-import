/**
 * @fileoverview Disallow imports from the app layer
 */
'use strict';

const micromatch = require('micromatch');
const { getFilename, normalizeSeparators, parseFsdPath } = require('../helpers/helpers');

const FORBIDDEN_APP_IMPORT = 'forbiddenAppImport';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow imports from the app layer.',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/forbidden-app-imports.md',
        },
        messages: {
            [FORBIDDEN_APP_IMPORT]: 'Imports from the app layer are forbidden.',
        },
        schema: [{
            type: 'object',
            properties: {
                alias: { type: 'string', description: 'Alias prefix used for absolute imports.' },
                rootDir: { type: 'string', description: 'Source root directory used to normalize imports.' },
                allowPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'App import patterns that are explicitly allowed.',
                },
                testFilesPatterns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filename patterns that may import from app.',
                },
            },
            additionalProperties: false,
        }],
        defaultOptions: [{ alias: '@', rootDir: 'src', allowPatterns: [], testFilesPatterns: [] }],
    },

    create(context) {
        const {
            alias = '@',
            rootDir = 'src',
            allowPatterns = [],
            testFilesPatterns = [],
        } = context.options[0] ?? {};
        const allowMatchers = allowPatterns.map(micromatch.matcher);
        const filename = normalizeSeparators(getFilename(context));
        const testFileMatchers = testFilesPatterns.map(micromatch.matcher);
        const isCurrentFileTesting = filename && testFileMatchers.some((matcher) => matcher(filename));

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const parsedImport = parseFsdPath(importPath, { alias, rootDir });

                if (parsedImport?.layer !== 'app'
                    || allowMatchers.some((matcher) => matcher(importPath))) {
                    return;
                }

                if (isCurrentFileTesting) {
                    return;
                }

                context.report({ node, messageId: FORBIDDEN_APP_IMPORT });
            },
        };
    },
};
