# Restrict imports to public API (public-api-imports)

Absolute imports should use a slice public API.

## Rule Details

This rule reports absolute imports that reach inside a slice instead of importing
from the slice public API. By default, it checks `entities`, `features`, `pages`,
and `widgets`.

Use `index.ts` as the regular public API entrypoint. The `testing.ts` entrypoint
is allowed only for files matching `testFilesPatterns`.

Auto-fix is available for deep imports. The fixer rewrites them to `layer/slice`
or `alias/layer/slice`.

## Rule Options

* `alias`: alias prefix used for absolute imports.
* `layersOverride`: layer names to check instead of the default layers.
* `testFilesPatterns`: glob patterns for files that may import from `testing.ts`.

```js
"fsd-import/public-api-imports": [
  "error",
  {
    alias: "@",
    layersOverride: ["features", "entities", "pages", "widgets"],
    testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"]
  }
]
```

Project structure example:

```
src
  pages
    Main
      ui
        MainPage.tsx
      index.ts
  widgets
    Sidebar
      model
        types
          sidebar.ts
      ui
        Sidebar.tsx
      index.ts
      testing.ts
  shared
    config
      StoreDecorator.tsx
```

```js
// index.ts and testing.ts
export type { ISidebarItem } from './model/types/sidebar';
```

Examples of **incorrect** code for this rule:

```js
// "fsd-import/public-api-imports": "error"
// in MainPage.tsx
import { ISidebarItem } from 'widgets/Sidebar/model/types/sidebar';

// "fsd-import/public-api-imports": ["error", { alias: "@" }]
// in MainPage.tsx
import { ISidebarItem } from '@/widgets/Sidebar/model/types/sidebar';

// "fsd-import/public-api-imports": ["error", { layersOverride: ["_widgets"]}]
// in MainPage.tsx
import { ISidebarItem } from '_widgets/Sidebar/model/types/sidebar';

// "fsd-import/public-api-imports": ["error", { alias: "@", testFilesPatterns: ['**/StoreDecorator.tsx'] }]
// in MainPage.tsx
import { ISidebarItem } from '@/widgets/Sidebar/testing';
```

Examples of **correct** code for this rule:

```js
// "fsd-import/public-api-imports": "error"
// in MainPage.tsx
import { ISidebarItem } from 'widgets/Sidebar';

// "fsd-import/public-api-imports": ["error", { alias: "@"}]
// in MainPage.tsx
import { ISidebarItem } from '@/widgets/Sidebar';

// "fsd-import/public-api-imports": ["error", { layersOverride: ["_widgets"]}]
// in MainPage.tsx
import { ISidebarItem } from '_widgets/Sidebar';

// "fsd-import/public-api-imports": ["error", { alias: "@", testFilesPatterns: ['**/StoreDecorator.tsx'] }]
// in StoreDecorator.tsx
import { ISidebarItem } from '@/widgets/Sidebar/testing';
```

## When Not To Use It

If you do not use Feature-Sliced Design in your project.
