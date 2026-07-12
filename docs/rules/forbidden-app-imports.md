# Disallow app-layer imports (forbidden-app-imports)

Reports imports from the `app` layer. Use explicit exceptions only for bootstrap,
setup, or test code that genuinely needs the application entry layer.

## Rule Options

* `alias`: absolute-import alias. Defaults to `@`.
* `rootDir`: source-root prefix to normalize. Defaults to `src`.
* `allowPatterns`: app import glob patterns to allow.
* `testFilesPatterns`: importing filename glob patterns that may use app imports.

```js
"fsd-import/forbidden-app-imports": ["error", {
  alias: "@",
  rootDir: "src",
  allowPatterns: ["app/providers"],
  testFilesPatterns: ["**/*.setup.ts"]
}]
```

Examples of **incorrect** code:

```js
import { store } from '@/app/providers/store';
```

Examples of **correct** code:

```js
// Matches allowPatterns after alias and rootDir normalization.
import { providers } from '@/app/providers';

// In a file matching **/*.setup.ts.
import { store } from '@/app/providers/store';
```

The rule is diagnostic-only and does not autofix architectural boundaries.
