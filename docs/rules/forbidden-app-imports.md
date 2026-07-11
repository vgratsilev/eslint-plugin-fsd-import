# Disallow app-layer imports (forbidden-app-imports)

Reports imports from the `app` layer. Use explicit exceptions only for bootstrap,
setup, or test code that genuinely needs the application entry layer.

## Rule Options

* `alias`: absolute-import alias. Defaults to `@`.
* `rootDir`: source-root prefix to normalize. Defaults to `src`.
* `allowPatterns`: app import glob patterns to allow.
* `testFilesPatterns`: importing filename glob patterns that may use app imports.

The rule is diagnostic-only and does not autofix architectural boundaries.
