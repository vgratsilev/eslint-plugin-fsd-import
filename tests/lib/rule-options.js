'use strict';

const assert = require('assert');
const Linter = require('eslint').Linter;

const rules = {
    'fsd-relative-path': require('../../lib/rules/fsd-relative-path'),
    'layer-imports': require('../../lib/rules/layer-imports'),
    'no-cross-slice-relative-imports': require('../../lib/rules/no-cross-slice-relative-imports'),
    'public-api-imports': require('../../lib/rules/public-api-imports'),
};

function runWithOptions(name, rule, options) {
    return new Linter().verify('const value = 1;', [{
        languageOptions: {
            ecmaVersion: 6,
            sourceType: 'module',
        },
        plugins: {
            'fsd-import': {
                rules: {
                    [name]: rule,
                },
            },
        },
        rules: {
            [`fsd-import/${name}`]: ['error', ...options],
        },
    }]);
}

describe('rule option schemas', () => {
    it('accepts the documented option shapes', () => {
        assert.deepStrictEqual(runWithOptions('fsd-relative-path', rules['fsd-relative-path'], [{ alias: '@', rootDir: 'src' }]), []);
        assert.deepStrictEqual(runWithOptions('layer-imports', rules['layer-imports'], [{
            alias: '@',
            rootDir: 'src',
            ignoreImportPatterns: ['**/generated'],
        }]), []);
        assert.deepStrictEqual(runWithOptions('public-api-imports', rules['public-api-imports'], [{
            alias: '@',
            rootDir: 'src',
            layersOverride: ['entities'],
            testFilesPatterns: ['**/*.test.ts'],
        }]), []);
        assert.deepStrictEqual(runWithOptions('no-cross-slice-relative-imports', rules['no-cross-slice-relative-imports'], [{
            rootDir: 'src',
            layers: ['entities'],
            ignoreImportPatterns: ['**/generated'],
        }]), []);
    });

    it('rejects unknown keys, non-string pattern entries, and extra options', () => {
        const invalidOptions = [
            ['fsd-relative-path', [{ alias: '@', unknown: true }]],
            ['layer-imports', [{ ignoreImportPatterns: ['**/ok', 1] }]],
            ['public-api-imports', [{ testFilesPatterns: [1] }]],
            ['no-cross-slice-relative-imports', [{ layers: ['entities', 1] }]],
            ['fsd-relative-path', [{}, {}]],
        ];

        for (const [name, options] of invalidOptions) {
            assert.throws(
                () => runWithOptions(name, rules[name], options),
                /Key "rules"/,
            );
        }
    });
});
