# Require relative imports within a single slice (fsd-relative-path)

Checks that imports within the same Feature-Sliced Design
([FSD](https://feature-sliced.design/)) slice use relative paths.

## Rule Details

This rule reports non-relative imports when the importing file and imported module
belong to the same FSD slice. Auto-fix is available.

The rule checks the following layers: `entities`, `features`, `pages`, `shared`,
and `widgets`.

## Rule Options

* `alias`: alias prefix used for absolute imports.

```js
"fsd-import/fsd-relative-path": ["error", { alias: "@" }]
```

Project structure example:

```
src
  widgets
    Sidebar
      model
        types
          sidebar.ts
      ui
        Sidebar.tsx
      index.ts
```

Examples of **incorrect** code for this rule:

```js
// "fsd-import/fsd-relative-path": "error"
// in Sidebar.tsx
import { ISidebarItem } from 'widgets/Sidebar/model/types/sidebar';

// "fsd-import/fsd-relative-path": ["error", { alias: "@" }]
// in Sidebar.tsx
import { ISidebarItem } from '@/widgets/Sidebar/model/types/sidebar';
```

Examples of **correct** code for this rule:

```js
// in Sidebar.tsx
import { ISidebarItem } from '../model/types/sidebar';

// in index.ts
import { ISidebarItem } from './model/types/sidebar';
```

## When Not To Use It

If you do not use Feature-Sliced Design in your project.
