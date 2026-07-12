'use strict';

const assert = require('assert');
const { Linter } = require('eslint');
const { version } = require('eslint/package.json');
const plugin = require('../lib');

const expectedRules = Object.keys(plugin.rules)
    .filter((ruleName) => ruleName !== 'public-api-imports')
    .map((ruleName) => `fsd-import/${ruleName}`)
    .sort();
const eslintMajor = Number(version.split('.')[0]);

function verifyLegacyRecommendedConfig() {
    const linter = new Linter();

    for (const [ruleName, rule] of Object.entries(plugin.rules)) {
        linter.defineRule(`fsd-import/${ruleName}`, rule);
    }

    const messages = linter.verify('export const value = 1;', {
        parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
        rules: plugin.configs.recommended.rules,
    });

    assert.deepStrictEqual(messages, []);
}

function verifyFlatRecommendedConfig() {
    const messages = new Linter().verify('export const value = 1;', [
        plugin.configs['flat/recommended'],
    ]);

    assert.deepStrictEqual(messages, []);
}

assert.deepStrictEqual(Object.keys(plugin.configs.recommended.rules).sort(), expectedRules);
assert.deepStrictEqual(Object.keys(plugin.configs['flat/recommended'].rules).sort(), expectedRules);
assert.strictEqual(plugin.configs.recommended.plugins[0], 'fsd-import');
assert.strictEqual(plugin.configs['flat/recommended'].plugins['fsd-import'], plugin);

if (eslintMajor >= 9) {
    verifyFlatRecommendedConfig();
} else {
    verifyLegacyRecommendedConfig();
}

process.stdout.write(`Verified recommended configurations with ESLint ${version}.\n`);
