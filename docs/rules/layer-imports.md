# Allow imports only from layers strictly below (layer-imports)

In [FSD](https://feature-sliced.design/docs/get-started/overview) the layers are vertically arranged. 
Modules on one layer can only interact with modules from the layers strictly below.

There are currently seven of them (bottom to top):

* `app` — app-wide settings, styles and providers.
* `processes` — complex inter-page scenarios. (e.g., authentication)
* `pages` — compositional layer to construct full pages from entities, features and widgets.
* `widgets` — compositional layer to combine entities and features into meaningful blocks.(e.g. IssuesList, UserProfile)
* `features` — user interactions, actions that bring business value to the user.(e.g. SendComment, AddToCart, UsersSearch)
* `entities` — business entities.(e.g., User, Product, Order)
* `shared` — reusable functionality, detached from the specifics of the project/business.(e.g. UIKit, libs, API)

## Rule Details

This rule reports on imports from higher layers into layer below. Only `entities` and `shared` can import from the same layers.

## Rule Options

* `alias`: specify this option if you use aliases.
* `ignoreImportPatterns`: specify regex for import from test files.

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

// "fsd-import/layer-imports": ["error", { alias: "@", testFilesPatterns: ['**/StoreDecorator.tsx'] }]
// in src/shared/StoreDecorator.tsx
import { StateSchema } from '@/app/providers/StoreProvider';
```

## When Not To Use It

If you do not use Feature Slices Design in your project.
