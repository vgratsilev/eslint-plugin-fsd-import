'use strict';

const assert = require('assert');
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
    });
});
