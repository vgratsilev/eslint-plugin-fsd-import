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

The fixer never moves files or accesses the filesystem.
