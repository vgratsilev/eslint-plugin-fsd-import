/**
 * @fileoverview Restrict imports only from public API
 * @author vgratsilev
 */
'use strict';

const path = require('path');
const micromatch = require('micromatch');
const { isPathRelative } = require('../helpers/helpers');

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Restrict imports only from public API',
            recommended: true,
            url: 'https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/public-api-imports.md',
        },
        fixable: 'code',
        messages: {
            [PUBLIC_ERROR]: 'Absolute import is allowed only from public API (index.ts).',
            [TESTING_PUBLIC_ERROR]: 'Test data should be imported from public API (testing.ts).',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                    testFilesPatterns: {
                        type: 'array',
                    },
                },
            },
        ],
    },

    create(context) {
        const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

        const checkingLayers = {
            'entities': 'entities',
            'features': 'features',
            'pages': 'pages',
            'widgets': 'widgets',
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                // example: src/entities/Article
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                if (isPathRelative(importTo)) {
                    return;
                }

                // [entities, article, model, types]
                const segments = importTo.split('/');
                const layer = segments[0];
                const slice = segments[1];

                if (!checkingLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = segments.length > 2;

                // [entities, article, testing]
                const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report({
                        node, messageId: PUBLIC_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(node.source, `'${alias ? alias + '/' : ''}${layer}/${slice}'`);
                        },
                    });
                }

                if (isTestingPublicApi) {
                    // example: C:\Users\Vadim\Documents\Github\react-blog\src\entities\Article
                    const currentFilePath = context.getFilename();
                    const normalizedPath = path.toNamespacedPath(currentFilePath).replace(/\\/g, '/');

                    const isCurrentFileTesting = testFilesPatterns.some(
                        (pattern) => micromatch.isMatch(normalizedPath, pattern),
                    );

                    if (!isCurrentFileTesting) {
                        context.report({ node, messageId: TESTING_PUBLIC_ERROR });
                    }
                }
            },
        };
    },
};
