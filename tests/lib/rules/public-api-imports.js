/**
 * @fileoverview Restrict imports only from public API
 * @author vgratsilev
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
    RuleTester = require('eslint').RuleTester,
    // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
    parser = require('@typescript-eslint/parser');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        parser,
        sourceType: 'module',
    },
});

const aliasOptions = [
    {
        alias: '@',
    },
];

const layersOverride = [
    'arbitraryLayer'
];

const layersOverrideOptions = [
    {
        layersOverride
    }
];


ruleTester.run('public-api-imports', rule, {
    valid: [
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'../../model/slice/addCommentFormSlice\';',
        },
        {
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\';',
            options: aliasOptions,
        },
        {
            code: `import { addCommentFormActions, addCommentFormReducer } from '${layersOverride[0]}/Article';`,
            options: layersOverrideOptions,
        },
        {
            code: `import { addCommentFormActions, addCommentFormReducer } from '@/${layersOverride[0]}/Article';`,
            options: [{alias: aliasOptions[0].alias, layersOverride: layersOverrideOptions[0].layersOverride}],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing\'',
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/testing\'',
            options: [{ testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'] }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing\'',
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\StoreDecorator.tsx',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing\'',
            options: [{
                alias: '@',
                testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx'],
            }],
        },
        {
            code: 'import { Article } from \'some-@/entities/Article/model\';',
            options: [{ alias: '@', rootDir: 'client' }],
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
            code: `import { addCommentFormActions, addCommentFormReducer } from '${layersOverride[0]}/Article/model/slice/addCommentFormSlice.ts';`,
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: layersOverrideOptions,
            output: `import { addCommentFormActions, addCommentFormReducer } from '${layersOverride[0]}/Article';`
        },
        {
            code: `import { addCommentFormActions, addCommentFormReducer } from '@/${layersOverride[0]}/Article/model/slice/addCommentFormSlice.ts';`,
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: [{alias: aliasOptions[0].alias, layersOverride: layersOverrideOptions[0].layersOverride}],
            output: `import { addCommentFormActions, addCommentFormReducer } from '@/${layersOverride[0]}/Article';`
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
        {
            code: 'import { Article } from \'client/entities/Article/model\';',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            options: [{ rootDir: 'client' }],
            output: 'import { Article } from \'client/entities/Article\';',
        },
        {
            code: 'import type { Article } from "entities/Article/model";',
            errors: [{ message: 'Absolute import is allowed only from public API (index.ts).' }],
            output: 'import type { Article } from "entities/Article";',
        },
    ],
});
