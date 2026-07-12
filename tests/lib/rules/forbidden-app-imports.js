'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbidden-app-imports');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

ruleTester.run('forbidden-app-imports', rule, {
    valid: [
        { code: 'import { Button } from \'shared/ui\';' },
        { code: 'import { app } from \'app/providers\';', options: [{ allowPatterns: ['app/providers'] }] },
        {
            code: 'import { app } from \'@/app/providers\';',
            options: [{ alias: '@', allowPatterns: ['app/providers'] }],
        },
        {
            filename: '/project/src/app/setup.test.ts',
            code: 'import { app } from \'@/app/providers\';',
            options: [{ alias: '@', testFilesPatterns: ['**/*.test.ts'] }],
        },
        { code: 'import { React } from \'react\';' },
    ],
    invalid: [
        {
            code: 'import { app } from \'app/providers\';',
            errors: [{ message: 'Imports from the app layer are forbidden.' }],
        },
        {
            code: 'import { app } from \'@/app/providers\';',
            options: [{ alias: '@' }],
            errors: [{ message: 'Imports from the app layer are forbidden.' }],
        },
    ],
});
