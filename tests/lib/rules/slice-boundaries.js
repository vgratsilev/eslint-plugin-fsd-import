'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/slice-boundaries');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

ruleTester.run('slice-boundaries', rule, {
    valid: [
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { model } from \'entities/Article\';',
        },
        {
            filename: '/project/src/entities/Article/ui/Card.test.ts',
            code: 'import { User } from \'entities/User\';',
            options: [{ testFilesPatterns: ['**/*.test.ts'] }],
        },
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { User } from \'../../User/model\';',
        },
    ],
    invalid: [
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { User } from \'entities/User\';',
            errors: [{ message: 'Imports must not cross FSD slice boundaries.' }],
        },
        {
            filename: '/project/client/entities/Article/ui/Card.ts',
            code: 'import { User } from \'@/client/entities/User\';',
            options: [{ alias: '@', rootDir: 'client' }],
            errors: [{ message: 'Imports must not cross FSD slice boundaries.' }],
        },
    ],
});
