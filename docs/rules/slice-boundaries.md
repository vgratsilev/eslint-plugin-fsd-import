# Enforce slice boundaries (slice-boundaries)

Disallows importing another slice's public API within the same configured FSD
layer. It complements focused rules for deep absolute and relative imports.

## Rule Options

* `alias`: absolute-import alias. Defaults to `@`.
* `rootDir`: source root directory. Defaults to `src`.
* `layers`: checked slice-based layers. Defaults to `entities`, `features`,
  `pages`, and `widgets`.
* `allowTestingPublicApi`: allows matching test files to use another slice's
  public API. Defaults to `true`.
* `testFilesPatterns`: filename glob patterns for that exception.

See [the overlap policy](slice-boundaries-design.md) for the rule ownership
matrix. The rule has no autofix.
