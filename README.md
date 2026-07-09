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
  {
    plugins: {
      "fsd-import": fsdImport,
    },
    rules: {
      "fsd-import/fsd-relative-path": "error",
      "fsd-import/public-api-imports": "error",
      "fsd-import/layer-imports": "error",
    },
  },
];
```

### Legacy config

For ESLint v8 and older, add `fsd-import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["fsd-import"],
  "rules": {
    "fsd-import/fsd-relative-path": "error",
    "fsd-import/public-api-imports": "error",
    "fsd-import/layer-imports": "error"
  }
}
```

## Supported Rules

Check that FSD imports are correct:

- [fsd-relative-path](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/fsd-relative-path.md) - imports within one slice should be relative.
- [public-api-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/public-api-imports.md) - absolute imports should use the public API.
- [layer-imports](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/layer-imports.md) - modules can import only from allowed lower FSD layers; `entities` and `shared` may also import from the same layer.

Rule-specific options and examples are documented on each rule page.

