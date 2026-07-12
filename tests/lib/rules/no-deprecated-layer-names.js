'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-deprecated-layer-names');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
});

ruleTester.run('no-deprecated-layer-names', rule, {
    valid: [
        { code: 'import { User } from \'entities/User\';', options: [{ layersMap: { oldEntities: 'entities' } }] },
        { code: 'import { User } from \'@app/entities/User\';', options: [{ alias: '@', layersMap: { oldEntities: 'entities' } }] },
    ],
    invalid: [
        {
            code: 'import { User } from \'oldEntities/User/model\';',
            options: [{ layersMap: { oldEntities: 'entities' } }],
            errors: [{ message: 'Layer "oldEntities" is deprecated; use "entities" instead.' }],
            output: 'import { User } from \'entities/User/model\';',
        },
        {
            code: 'import { User } from "@/oldEntities/User";',
            options: [{ alias: '@', layersMap: { oldEntities: 'entities' } }],
            errors: [{ message: 'Layer "oldEntities" is deprecated; use "entities" instead.' }],
            output: 'import { User } from "@/entities/User";',
        },
    ],
});
