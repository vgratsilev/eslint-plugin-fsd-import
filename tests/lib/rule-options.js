'use strict';

const assert = require('assert');
const Linter = require('eslint').Linter;

const rules = {
    'forbidden-app-imports': require('../../lib/rules/forbidden-app-imports'),
    'fsd-relative-path': require('../../lib/rules/fsd-relative-path'),
    'layer-imports': require('../../lib/rules/layer-imports'),
    'no-cross-slice-relative-imports': require('../../lib/rules/no-cross-slice-relative-imports'),
    'no-deprecated-layer-names': require('../../lib/rules/no-deprecated-layer-names'),
    'public-api-imports': require('../../lib/rules/public-api-imports'),
    'shared-public-api-imports': require('../../lib/rules/shared-public-api-imports'),
    'slice-boundaries': require('../../lib/rules/slice-boundaries'),
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
        assert.deepStrictEqual(runWithOptions('forbidden-app-imports', rules['forbidden-app-imports'], [{
            rootDir: 'src',
            allowPatterns: ['app/providers'],
            testFilesPatterns: ['**/*.test.ts'],
        }]), []);
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
        assert.deepStrictEqual(runWithOptions('no-deprecated-layer-names', rules['no-deprecated-layer-names'], [{
            alias: '@',
            layersMap: { oldEntities: 'entities' },
        }]), []);
        assert.deepStrictEqual(runWithOptions('shared-public-api-imports', rules['shared-public-api-imports'], [{
            rootDir: 'src',
            segments: ['ui'],
            ignoreImportPatterns: ['**/generated'],
        }]), []);
        assert.deepStrictEqual(runWithOptions('slice-boundaries', rules['slice-boundaries'], [{
            alias: '@',
            rootDir: 'src',
            layers: ['entities'],
            allowTestingPublicApi: true,
            testFilesPatterns: ['**/*.test.ts'],
        }]), []);
    });

    it('rejects unknown keys, non-string pattern entries, and extra options', () => {
        const invalidOptions = [
            ['forbidden-app-imports', [{ allowPatterns: [1] }]],
            ['forbidden-app-imports', [{ unknown: true }]],
            ['fsd-relative-path', [{ alias: '@', unknown: true }]],
            ['layer-imports', [{ ignoreImportPatterns: ['**/ok', 1] }]],
            ['public-api-imports', [{ testFilesPatterns: [1] }]],
            ['no-cross-slice-relative-imports', [{ layers: ['entities', 1] }]],
            ['no-deprecated-layer-names', [{ layersMap: { oldEntities: 1 } }]],
            ['no-deprecated-layer-names', [{ unknown: true }]],
            ['shared-public-api-imports', [{ segments: ['ui', 1] }]],
            ['shared-public-api-imports', [{ unknown: true }]],
            ['slice-boundaries', [{ allowTestingPublicApi: 'yes' }]],
            ['slice-boundaries', [{ testFilesPatterns: [1] }]],
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
