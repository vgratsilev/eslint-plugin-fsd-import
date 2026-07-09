# Restrict imports between FSD layers (layer-imports)

In [FSD](https://feature-sliced.design/docs/get-started/overview), layers are
vertically arranged. This rule restricts imports to the layers allowed by the FSD
hierarchy.

The rule checks the following layers, from highest to lowest:

* `app`
* `pages`
* `widgets`
* `features`
* `entities`
* `shared`

## Rule Details

This rule reports imports from disallowed higher layers.

Allowed imports:

* `app` can import from `pages`, `widgets`, `features`, `entities`, and `shared`.
* `pages` can import from `widgets`, `features`, `entities`, and `shared`.
* `widgets` can import from `features`, `entities`, and `shared`.
* `features` can import from `entities` and `shared`.
* `entities` can import from `entities` and `shared`.
* `shared` can import from `shared`.

## Rule Options

* `alias`: alias prefix used for absolute imports.
* `ignoreImportPatterns`: glob patterns for import paths that should skip this rule.

Examples of **incorrect** code for this rule:

```js
// "fsd-import/layer-imports": "error"
// in src/entities/Article/file.tsx
import { Button } from 'features/Button.tsx';

// "fsd-import/layer-imports": ["error", { alias: "@" }]
// in src/entities/Article/file.tsx
import { Button } from '@/features/Button.tsx';

// "fsd-import/layer-imports": ["error", { alias: "@" }]
// in src/shared/StoreDecorator.tsx
import { StateSchema } from '@/app/providers/StoreProvider';
```

Examples of **correct** code for this rule:

```js
// "fsd-import/layer-imports": "error"
// in src/entities/Article/file.tsx
import { Button } from 'shared/Button.tsx';

// "fsd-import/layer-imports": ["error", { alias: "@" }]
// in src/entities/Article/file.tsx
import { Button } from '@/shared/Button.tsx';

// "fsd-import/layer-imports": ["error", { alias: "@", ignoreImportPatterns: ['**/StoreProvider'] }]
// in src/shared/StoreDecorator.tsx
import { StateSchema } from '@/app/providers/StoreProvider';
```

## When Not To Use It

If you do not use Feature-Sliced Design in your project.
