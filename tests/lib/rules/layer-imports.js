/**
 * @fileoverview Restrict imports only from layers below
 * @author vgratsilev
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/layer-imports'),
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

ruleTester.run('layer-imports', rule, {
    valid: [
        {
            filename: 'C:\\project\\src\\features\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'shared/Button/Button.tsx\';',
            errors: [],
        },
        {
            filename: 'C:\\project\\src\\features\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/shared/Button/Button.tsx\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\features\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Button/Button.tsx\';',
            errors: [],
        },
        {
            filename: 'C:\\project\\src\\features\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Button/Button.tsx\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Button/Button.tsx\';',
            errors: [],
        },
        {
            filename: 'C:\\project\\src\\app\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Button/Button.tsx\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\widgets\\Article\\file.test.ts',
            code: 'import { useLocation } from \'react-router-dom\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\index.tsx',
            code: 'import { useLocation } from \'@/app/test.ts\';',
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\entities\\Article.tsx',
            code: 'import { StateSchema } from \'@/app/providers/StoreProvider\';',
            errors: [],
            options: [
                {
                    alias: '@',
                    ignoreImportPatterns: ['**/StoreProvider'],
                },
            ],
        },
    ],

    invalid: [
        {
            filename: 'C:\\project\\src\\entities\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/features/Button.tsx\';',
            errors: [{ message: 'Current layer can import only layers below: (entities, shared).' }],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\features\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Button.tsx\';',
            errors: [{ message: 'Current layer can import only layers below: (entities, shared).' }],
            options: aliasOptions,
        },
        {
            filename: 'C:\\project\\src\\widgets\\Article\\file.test.ts',
            code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/pages/Main.tsx\';',
            errors: [{ message: 'Current layer can import only layers below: (features, entities, shared).' }],
            options: aliasOptions,
        },
    ],
});
