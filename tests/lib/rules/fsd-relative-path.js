/**
 * @fileoverview Restrict only relative path imports within single slice
 * @author vgratsilev
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/fsd-relative-path'),
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
ruleTester.run('fsd-relative-path', rule, {
    valid: [
        {
            filename: 'C:\\project\\src\\entities\\Article',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'../../model/slice/addCommentFormSlice\';',
        },
        {
            filename: '/project/client/entities/Article/index.ts',
            code: 'import { Article } from \'some-@/entities/Article/model\';',
            options: [{ alias: '@', rootDir: 'client' }],
        },
    ],

    invalid: [
        {
            filename: 'C:\\project\\src\\entities\\Article\\index.ts',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'entities/Article/model/slice/addCommentFormSlice\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            output: 'import { addCommentFormReducer, addCommentFormActions } from \'./model/slice/addCommentFormSlice\';',
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\index.ts',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'@/entities/Article/model/slice/addCommentFormSlice\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            options: [{ alias: '@' }],
            output: 'import { addCommentFormReducer, addCommentFormActions } from \'./model/slice/addCommentFormSlice\';',
        },
        {
            filename: 'C:\\project\\src\\entities\\Article\\ui\\ArticlePage\\ArticlePage.tsx',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'entities/Article/model/slice/addCommentFormSlice\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            output: 'import { addCommentFormReducer, addCommentFormActions } from \'../../model/slice/addCommentFormSlice\';',
        },
        {
            filename: '/project/client/entities/Article/index.ts',
            code: 'import { Article } from \'client/entities/Article/model\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            options: [{ rootDir: 'client' }],
            output: 'import { Article } from \'./model\';',
        },
        {
            filename: '/project/src/entities/Article/index.ts',
            code: 'import type { Article } from "entities/Article/model";',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            output: 'import type { Article } from "./model";',
        },
    ],
});
