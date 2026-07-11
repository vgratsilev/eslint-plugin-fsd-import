# eslint-plugin-fsd-import

ESLint plugin for checking import paths in [Feature-Sliced Design](https://feature-sliced.design/) projects.

## Installation

Install [ESLint](https://eslint.org/) and `eslint-plugin-fsd-import`:

```sh
npm install --save-dev eslint eslint-plugin-fsd-import
```

## Usage

### Flat config

For ESLint v9 and newer, add the plugin to `eslint.config.js`:

```js
const fsdImport = require("eslint-plugin-fsd-import");

module.exports = [
  fsdImport.configs["flat/recommended"],
];
```

### Legacy config

For ESLint v8 and older, add `fsd-import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "extends": ["plugin:fsd-import/recommended"]
}
```

Both recommended presets enable every exported rule except
`public-api-imports`. That rule is opt-in because testing-file exceptions and
layer choices are project-specific. Enable it with the project alias and source
root when appropriate:

```js
{
  rules: {
    "fsd-import/public-api-imports": ["error", {
      alias: "@",
      rootDir: "src",
      testFilesPatterns: ["**/*.test.ts"]
    }]
  }
}
```

## Supported Rules

Check that FSD imports are correct:

- [fsd-relative-path](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/fsd-relative-path.md) - imports within one slice should be relative.
- [no-cross-slice-relative-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/no-cross-slice-relative-imports.md) - relative imports cannot leave a slice.
- [layer-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/layer-imports.md) - modules can import only from allowed lower FSD layers; `entities` and `shared` may also import from the same layer.
- [public-api-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/public-api-imports.md) - opt-in absolute imports should use the public API.
- [shared-public-api-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/shared-public-api-imports.md) - shared segments must use their public API.
- [forbidden-app-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/forbidden-app-imports.md) - imports from `app` need explicit exceptions.
- [no-deprecated-layer-names](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/no-deprecated-layer-names.md) - maps legacy layer names in imports.
- [slice-boundaries](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/slice-boundaries.md) - prevents cross-slice public-API imports.

Rule-specific options and examples are documented on each rule page.

## Contributing

When adding a rule, register it explicitly in `lib/index.js`, add its tests and
documentation, and include it in the published configuration when appropriate.
