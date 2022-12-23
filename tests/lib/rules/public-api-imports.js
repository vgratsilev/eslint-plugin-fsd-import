/**
 * @fileoverview Restrict imports only from public API
 * @author vgratsilev
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

const aliasOptions = [
    {
        alias: '@',
    },
];

ruleTester.run('public-api-imports', rule, {
    valid: [
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'../../model/slice/addCommentFormSlice\';',
            errors: [],
        },
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing\'',
            errors: [],
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing\'',
            errors: [],
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing\'',
            errors: [],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing\'',
            errors: [],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
        },
    ],

    invalid: [
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/model/slice/addCommentFormSlice.ts\';',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            output: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article\';'
        },
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/model/slice/addCommentFormSlice.ts\';',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: aliasOptions,
            output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\';'
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing/file.tsx\';',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
            output: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article\';'
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing/file.tsx\';',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
            output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\';'
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\forbidden.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing\';',
            errors: [{ message: 'Test data should be imported from public API (testing.ts).' }],
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\forbidden.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing\';',
            errors: [{ message: 'Test data should be imported from public API (testing.ts).' }],
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
        },
    ],
});
