/**
 * @fileoverview feature sliced relative path checker
 * @author vgratsilev
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/fsd-relative-path'),
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
ruleTester.run('fsd-relative-path', rule, {
    valid: [
        {
            filename: 'C:\\Users\\Vadim\\Documents\\Github\\react-blog\\src\\entities\\Article',
            code: 'import { addCommentFormActions, addCommentFormReducer, } from \'../../model/slice/addCommentFormSlice\';',
            errors: [],
        },
    ],

    invalid: [
        {
            filename: 'C:\\Users\\Vadim\\Documents\\Github\\react-blog\\src\\entities\\Article',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'entities/Article/model/slice/addCommentFormSlice\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
        },
        {
            filename: 'C:\\Users\\Vadim\\Documents\\Github\\react-blog\\src\\entities\\Article',
            code: 'import { addCommentFormReducer, addCommentFormActions } from \'@/entities/Article/model/slice/addCommentFormSlice\';',
            errors: [{ message: 'Within one slice all paths should be related.' }],
            options: [{ alias: '@' }],
        },
    ],
});
