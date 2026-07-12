'use strict';

const assert = require('assert');
const Linter = require('eslint').Linter;
const rules = {
    'no-cross-slice-relative-imports': require('../../lib/rules/no-cross-slice-relative-imports'),
    'public-api-imports': require('../../lib/rules/public-api-imports'),
    'slice-boundaries': require('../../lib/rules/slice-boundaries'),
};

function lint(code, enabledRules) {
    return new Linter().verify(code, [{
        files: ['**/*.ts'],
        languageOptions: { ecmaVersion: 6, sourceType: 'module' },
        plugins: { 'fsd-import': { rules } },
        rules: enabledRules,
    }], { filename: 'src/entities/Article/ui/Card.ts' });
}

describe('rule overlap policy', () => {
    it('lets public-api-imports own deep absolute imports', () => {
        assert.deepStrictEqual(
            lint('import { User } from \'entities/User/model\';', {
                'fsd-import/public-api-imports': 'error',
                'fsd-import/slice-boundaries': 'error',
            }).map((message) => message.ruleId),
            ['fsd-import/public-api-imports'],
        );
    });

    it('lets no-cross-slice-relative-imports own relative imports', () => {
        assert.deepStrictEqual(
            lint('import { User } from \'../../User/model\';', {
                'fsd-import/no-cross-slice-relative-imports': 'error',
                'fsd-import/slice-boundaries': 'error',
            }).map((message) => message.ruleId),
            ['fsd-import/no-cross-slice-relative-imports'],
        );
    });
});
