# Check imports have relative path within single slice (fsd-relative-path)

Check imports have relative path within single slice in project used Feature Slice
Design ([FSD](https://feature-sliced.design/)).

## Rule Details

This rule reports on non-relative path imports withing single slice.
Auto-fix available.

## Rule Options

* `alias`: specify this option if you use aliases.

```js
...
"fsd-import/fsd-relative-path": [<enabled>, { alias: string }] 
...
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
import { ISidebarItem } from '../../model/types/sidebar';

// in index.ts
import { ISidebarItem } from './model/types/sidebar';
```

## When Not To Use It

If you do not use Feature Slices Design in your project.
