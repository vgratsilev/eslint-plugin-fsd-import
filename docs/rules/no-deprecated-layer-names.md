# Migrate deprecated layer names (no-deprecated-layer-names)

Reports mapped legacy FSD layer names in import paths and safely rewrites only
the import module specifier.

## Rule Options

* `alias`: absolute-import alias. Defaults to an empty string.
* `layersMap`: mapping from deprecated layer name to replacement layer name.

```js
"fsd-import/no-deprecated-layer-names": ["error", {
  alias: "@",
  layersMap: { oldEntities: "entities" }
}]
```

Examples of **incorrect** code:

```js
import { User } from '@/oldEntities/User';
// Autofix: import { User } from '@/entities/User';
```

Examples of **correct** code:

```js
import { User } from '@/entities/User';
```

The fixer never moves files or accesses the filesystem.
