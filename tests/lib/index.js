'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Linter = require('eslint').Linter;
const plugin = require('../../lib');
const packageJson = require('../../package.json');

function getReadmeCodeBlock(readme, pattern, description) {
    const match = readme.match(pattern);

    assert.ok(match, `${description} example is missing`);

    return match[1];
}

function assertRuleExamplesAreParseable(document, ruleName) {
    const codeBlocks = [...document.matchAll(/```js\n([\s\S]*?)```/g)].map((match) => match[1]);
    const linter = new Linter();
    const config = [{ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } }];

    assert.strictEqual(codeBlocks.length, 3, `${ruleName} must have configuration and behavior examples`);
    assert.deepStrictEqual(linter.verify(`const rules = {${codeBlocks[0]}};`, config), []);
    assert.deepStrictEqual(linter.verify(codeBlocks[1], config), []);
    assert.deepStrictEqual(linter.verify(codeBlocks[2], config), []);
}

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

    it('links every rule document from the README', () => {
        const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');
        const linkedRules = [...readme.matchAll(/docs\/rules\/([\w-]+)\.md/g)]
            .map((match) => match[1])
            .sort();

        assert.deepStrictEqual(linkedRules, Object.keys(plugin.rules).sort());
    });

    it('uses parseable flat and legacy configuration examples', () => {
        const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');
        const flatConfig = getReadmeCodeBlock(
            readme,
            /### Flat config[\s\S]*?```js\n([\s\S]*?)```/,
            'Flat configuration',
        );
        const legacyConfig = getReadmeCodeBlock(
            readme,
            /### Legacy config[\s\S]*?```json\n([\s\S]*?)```/,
            'Legacy configuration',
        );

        assert.doesNotThrow(() => new Function('require', 'module', flatConfig));
        assert.doesNotThrow(() => JSON.parse(legacyConfig));
    });

    it('gives every new rule documentation behavior examples', () => {
        const newRuleNames = [
            'forbidden-app-imports',
            'no-cross-slice-relative-imports',
            'no-deprecated-layer-names',
            'shared-public-api-imports',
            'slice-boundaries',
        ];

        for (const ruleName of newRuleNames) {
            const document = fs.readFileSync(
                path.join(__dirname, `../../docs/rules/${ruleName}.md`),
                'utf8',
            );

            assert.match(document, /Examples of \*\*incorrect\*\* code/);
            assert.match(document, /Examples of \*\*correct\*\* code/);
            assertRuleExamplesAreParseable(document, ruleName);
        }
    });
});
