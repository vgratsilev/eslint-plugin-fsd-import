# Check imports have relative path within single slice (fsd-relative-path)

Check imports have relative path within single slice in project used Feature Slice Design ([FSD](https://feature-sliced.design/)).

## Rule Details

This rule reports on mom-relative path imports withing single slice.

Structure:
```
src
  widgets
    sidebar
      model
        types
          sidebar.ts
      ui
        sidebar.tsx
```

Examples of **incorrect** code for this rule:

```js
import { ISidebarItem } from 'widgets/Sidebar/model/types/sidebar';
```

Examples of **correct** code for this rule:

```js
import { ISidebarItem } from '../../model/types/sidebar';
```
