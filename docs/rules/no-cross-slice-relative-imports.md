# Disallow cross-slice relative imports (no-cross-slice-relative-imports)

Disallows relative imports that leave one Feature-Sliced Design slice and enter
another. Import another slice through its public API instead.

## Rule Options

* `rootDir`: source root directory. Defaults to `src`.
* `layers`: slice-based layers to check. Defaults to `entities`, `features`,
  `pages`, and `widgets`.
* `ignoreImportPatterns`: relative import glob patterns to exclude.

```js
"fsd-import/no-cross-slice-relative-imports": ["error", {
  rootDir: "src",
  layers: ["entities", "features", "pages", "widgets"],
  ignoreImportPatterns: []
}]
```

Examples of **incorrect** code:

```js
// in src/entities/Article/ui/Card.ts
import { User } from '../../User/model';
```

Examples of **correct** code:

```js
// in src/entities/Article/ui/Card.ts
import { model } from '../model/model';
import { User } from 'entities/User';
```

The rule has no autofix because a public API cannot be inferred safely from the
filesystem.
