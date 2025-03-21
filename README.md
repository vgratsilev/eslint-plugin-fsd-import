# @fsd-import/eslint-plugin

ESLint plugin for FSD projects, optimized for ESLint v9. Enhances code quality and enforces FSD best practices in modern JavaScript/TypeScript projects.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@fsd-import/eslint-plugin`:

```sh
npm install @fsd-import/eslint-plugin --save-dev
```

## Usage

Make sure you're running ESLint `v9.0.0` or higher for the latest version of this plugin to work. The following example is how your `eslint.config.js` should be set up for this plugin to work for you.

```js
import fsdImport from "@fsd-import/eslint-plugin";

export default [
  // ...
  fsdImport.configs.recommended
];
```

## Custom Configuration

If you want more fine-grained configuration, you can instead add a snippet like this to your ESLint configuration file:

```js
export default [
  {
    files: ["**/*.{ts,tsx}", "**/*.{js,jsx}"],
    plugins: {
      "@fsd-import": fsdImport,
    },
    rules: {
      "@fsd-import/relative-path": "error",
      "@fsd-import/layer-imports": "warn",
      "@fsd-import/public-api": "off",
    },
  },
];
```

```js
export default [
  {
    files: ["**/*.{ts,tsx}", "**/*.{js,jsx}"],
    extends: [
      ...fsdImport.configs.recommended
    ],
    rules: {
      "@fsd-import/relative-path": "error",
      "@fsd-import/layer-imports": "warn",
      "@fsd-import/public-api": "off",
    },
  },
];
```

## Supported Rules

This plugin checks if FSD imports are correct:

- [relative-path](https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/relative-path.md) - Imports within one slice should be relative.
- [public-api-imports](https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/public-api-imports.md) - Absolute imports should be only from the public API.
- [layer-imports](https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/layer-imports.md) - Modules on one layer can only interact with modules from the layers strictly below.

## Credits

- [eslint-plugin-fsd-import](https://www.npmjs.com/package/eslint-plugin-fsd-import) - This package is based on the original `eslint-plugin-fsd-import`, migrated to ESLint v9 with additional improvements and modifications.

## Legacy Configuration

If you're using an older version of ESLint (version `v8.57.0` or lower), refer to the original package: [eslint-plugin-fsd-import](https://www.npmjs.com/package/eslint-plugin-fsd-import).

## License

This project is licensed under the ISC License.

