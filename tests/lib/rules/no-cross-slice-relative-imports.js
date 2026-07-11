'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-cross-slice-relative-imports');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

ruleTester.run('no-cross-slice-relative-imports', rule, {
    valid: [
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { model } from \'../model/model\';',
        },
        {
            filename: '/project/src/shared/ui/Button.ts',
            code: 'import { util } from \'../../lib/format\';',
        },
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { User } from \'entities/User\';',
        },
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { User } from \'../../User/model\';',
            options: [{ ignoreImportPatterns: ['../../User/**'] }],
        },
    ],
    invalid: [
        {
            filename: '/project/src/entities/Article/ui/Card.ts',
            code: 'import { User } from \'../../User/model\';',
            errors: [{ message: 'Relative imports must not cross FSD slice boundaries.' }],
        },
        {
            filename: 'C:\\project\\src\\features\\Article\\ui\\Card.ts',
            code: 'import { User } from \'..\\\\..\\\\User\\\\model\';',
            errors: [{ message: 'Relative imports must not cross FSD slice boundaries.' }],
        },
        {
            filename: '/project/client/entities/Article/ui/Card.ts',
            code: 'import { User } from \'../../User/model\';',
            options: [{ rootDir: 'client' }],
            errors: [{ message: 'Relative imports must not cross FSD slice boundaries.' }],
        },
    ],
});
