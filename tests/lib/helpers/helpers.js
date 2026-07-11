'use strict';

const assert = require('assert');
const {
    extractPathFromRoot,
    getCurrentFileLayer,
    parseFsdPath,
    resolveRelativeTarget,
    stripAlias,
} = require('../../../lib/helpers/helpers');

describe('FSD path helpers', () => {
    it('strips only an exact leading alias segment', () => {
        assert.strictEqual(stripAlias('@/entities/User', '@'), 'entities/User');
        assert.strictEqual(stripAlias('some-@/entities/User', '@'), 'some-@/entities/User');
        assert.strictEqual(stripAlias('@app/entities/User', '@'), '@app/entities/User');
    });

    it('parses equivalent Unix and Windows filenames under the default root', () => {
        const unix = parseFsdPath('/project/src/entities/Article/ui/ArticlePage.tsx', {
            requireRoot: true,
        });
        const windows = parseFsdPath('C:\\project\\src\\entities\\Article\\ui\\ArticlePage.tsx', {
            requireRoot: true,
        });

        assert.deepStrictEqual(unix, {
            layer: 'entities',
            slice: 'Article',
            segments: ['entities', 'Article', 'ui', 'ArticlePage.tsx'],
            path: 'entities/Article/ui/ArticlePage.tsx',
        });
        assert.deepStrictEqual(windows, unix);
    });

    it('honors custom roots without matching root-like parent directory names', () => {
        assert.strictEqual(
            extractPathFromRoot('/workspace/src-tools/client/entities/User/index.ts', 'client'),
            'entities/User/index.ts',
        );
        assert.strictEqual(
            extractPathFromRoot('/workspace/src-tools/entities/User/index.ts', 'src'),
            null,
        );
        assert.strictEqual(
            getCurrentFileLayer('/workspace/src-tools/client/entities/User/index.ts', 'client'),
            'entities',
        );
    });

    it('returns null for unparseable or incomplete FSD paths', () => {
        assert.strictEqual(parseFsdPath('react'), null);
        assert.strictEqual(parseFsdPath('../entities/User'), null);
        assert.strictEqual(parseFsdPath('/outside/entities/User', { requireRoot: true }), null);
        assert.strictEqual(parseFsdPath('entities'), null);
        assert.strictEqual(parseFsdPath(null), null);
    });

    it('resolves relative targets with the same FSD semantics on Unix and Windows', () => {
        assert.strictEqual(
            resolveRelativeTarget('/project/src/entities/Article/ui/Card.tsx', '../User/model.ts'),
            'entities/Article/User/model.ts',
        );
        assert.strictEqual(
            resolveRelativeTarget('C:\\project\\src\\entities\\Article\\ui\\Card.tsx', '..\\User\\model.ts'),
            'entities/Article/User/model.ts',
        );
    });
});
