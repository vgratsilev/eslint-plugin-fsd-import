'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/shared-public-api-imports');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

ruleTester.run('shared-public-api-imports', rule, {
    valid: [
        { code: 'import { Button } from \'shared/ui\';' },
        { code: 'import { format } from \'shared/lib\';' },
        { code: 'import { Button } from \'@/shared/ui\';', options: [{ alias: '@' }] },
        { code: 'import { Button } from \'shared/ui/Button\';', options: [{ ignoreImportPatterns: ['**/Button'] }] },
        {
            code: 'import { Button } from \'@/shared/ui/Button\';',
            options: [{ alias: '@', ignoreImportPatterns: ['shared/ui/**'] }],
        },
        { code: 'import { Button } from \'entities/Button/ui\';' },
        { code: 'import { Button } from \'@vendor/src/shared/ui/Button\';' },
    ],
    invalid: [
        {
            code: 'import { Button } from \'shared/ui/Button\';',
            errors: [{ message: 'Shared imports must use the segment public API.' }],
            output: 'import { Button } from \'shared/ui\';',
        },
        {
            code: 'import { request } from "@/client/shared/api/request";',
            options: [{ alias: '@', rootDir: 'client' }],
            errors: [{ message: 'Shared imports must use the segment public API.' }],
            output: 'import { request } from "@/client/shared/api";',
        },
        {
            code: 'import { Button } from \'shared/ui/../Button\';',
            errors: [{ message: 'Shared imports must use the segment public API.' }],
        },
    ],
});
