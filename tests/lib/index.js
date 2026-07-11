'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const plugin = require('../../lib');
const packageJson = require('../../package.json');

describe('plugin export', () => {
    it('exports its shipped rules explicitly without requireindex', () => {
        assert.deepStrictEqual(Object.keys(plugin.rules).sort(), [
            'forbidden-app-imports',
            'fsd-relative-path',
            'layer-imports',
            'no-cross-slice-relative-imports',
            'no-deprecated-layer-names',
            'public-api-imports',
            'shared-public-api-imports',
            'slice-boundaries',
        ]);
        assert.strictEqual(packageJson.dependencies?.requireindex, undefined);
        assert.deepStrictEqual(Object.keys(packageJson.dependencies), ['micromatch']);
    });

    it('exposes equivalent legacy and flat recommended configurations', () => {
        const expectedRules = Object.keys(plugin.rules)
            .filter((ruleName) => ruleName !== 'public-api-imports')
            .map((ruleName) => `fsd-import/${ruleName}`)
            .sort();
        const legacyConfig = plugin.configs.recommended;
        const flatConfig = plugin.configs['flat/recommended'];

        assert.deepStrictEqual(legacyConfig.plugins, ['fsd-import']);
        assert.strictEqual(flatConfig.plugins['fsd-import'], plugin);
        assert.deepStrictEqual(Object.keys(legacyConfig.rules).sort(), expectedRules);
        assert.deepStrictEqual(Object.keys(flatConfig.rules).sort(), expectedRules);
        assert.strictEqual(legacyConfig.rules['fsd-import/public-api-imports'], undefined);
        assert.strictEqual(flatConfig.rules['fsd-import/public-api-imports'], undefined);
    });

    it('has a rule document for every exported rule', () => {
        for (const ruleName of Object.keys(plugin.rules)) {
            assert.strictEqual(
                fs.existsSync(path.join(__dirname, `../../docs/rules/${ruleName}.md`)),
                true,
                `${ruleName} documentation is missing`,
            );
        }
    });
});
