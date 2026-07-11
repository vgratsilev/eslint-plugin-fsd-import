'use strict';

const assert = require('assert');
const plugin = require('../../lib');
const packageJson = require('../../package.json');

describe('plugin export', () => {
    it('exports its shipped rules explicitly without requireindex', () => {
        assert.deepStrictEqual(Object.keys(plugin.rules).sort(), [
            'fsd-relative-path',
            'layer-imports',
            'no-cross-slice-relative-imports',
            'public-api-imports',
        ]);
        assert.strictEqual(packageJson.dependencies?.requireindex, undefined);
    });
});
