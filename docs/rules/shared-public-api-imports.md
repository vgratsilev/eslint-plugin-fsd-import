# Restrict shared imports to public APIs (shared-public-api-imports)

Requires imports from configured `shared` segments to use the segment public API.
For example, import `shared/ui` instead of `shared/ui/Button`.

## Rule Options

* `alias`: absolute-import alias. Defaults to `@`.
* `rootDir`: optional source-root prefix to normalize. Defaults to `src`.
* `segments`: shared segments with public APIs. Defaults to `ui`, `lib`, `api`,
  and `config`.
* `ignoreImportPatterns`: import glob patterns to exclude.

```js
"fsd-import/shared-public-api-imports": ["error", {
  alias: "@",
  rootDir: "src",
  segments: ["ui", "lib", "api", "config"],
  ignoreImportPatterns: ["shared/ui/legacy/**"]
}]
```

Examples of **incorrect** code:

```js
import { Button } from '@/shared/ui/Button';
// Autofix: import { Button } from '@/shared/ui';
```

Examples of **correct** code:

```js
import { Button } from '@/shared/ui';

// This path matches ignoreImportPatterns after alias normalization.
import { LegacyButton } from '@/shared/ui/legacy/Button';
```

The rule fixes only a direct, mechanical reduction to `shared/<segment>`. It
does not inspect the filesystem or invent missing public APIs.
