# eslint-plugin-fsd-import

Plugin for checking imports path in [FSD](https://feature-sliced.design/) project.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-import`:

```sh
npm install eslint-plugin-fsd-import --save-dev
```

## Usage

Add `fsd-import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-import"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-import/fsd-relative-path": "error"
    }
}
```

## Supported Rules

* [fsd-relative-path](https://github.com/vgratsilev/eslint-plugin-fsd-import/blob/main/docs/rules/fsd-relative-path.md)
Check FSD imports is correct. Imports within one slice should be relative.


