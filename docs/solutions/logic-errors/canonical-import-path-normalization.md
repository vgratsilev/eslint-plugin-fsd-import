---
title: Canonical import path normalization for FSD rules
date: 2026-07-12
category: logic-errors
module: FSD import rules
problem_type: logic_error
component: tooling
symptoms:
  - Alias imports did not match canonical allow and ignore glob patterns.
  - A module specifier containing rootDir outside its leading segment could be treated as a local shared import.
root_cause: logic_error
resolution_type: code_fix
severity: medium
related_components:
  - shared path helpers
  - rule option glob matching
  - rule documentation
  - ESLint compatibility verification
tags: [fsd-import, module-specifier, path-normalization, glob-exceptions, eslint-plugin]
---

# Canonical import path normalization for FSD rules

## Problem

FSD import rules compared the same module specifier in incompatible forms. For
example, an allow pattern for `app/providers` was evaluated against
`@/app/providers`, while a filesystem-root helper could remove `src` from the
middle of a package-like import.

## Symptoms

- `forbidden-app-imports` reported `@/app/providers` despite
  `alias: "@"` and `allowPatterns: ["app/providers"]`.
- `shared-public-api-imports` did not honor `shared/ui/**` for alias imports.
- `@vendor/src/shared/ui/Button` could be diagnosed and autofixed as if it
  were the local `shared/ui` module.
- Backslash-form relative imports did not match slash-form glob patterns.

## What Didn't Work

- Matching configured globs only against the raw source literal. Aliases and
  platform separators made equivalent imports compare differently.
- Reusing `extractPathFromRoot()` for a module specifier. Its any-segment
  search is correct for filenames and resolved relative targets, but too broad
  for a logical import namespace.

## Solution

Normalize import specifiers at the rule boundary and match FSD-oriented globs
against the parsed path as well as the normalized raw source when backward
compatibility needs it.

```js
const normalizedImportPath = normalizeSeparators(importPath);
const parsedImport = parseFsdPath(importPath, { alias, rootDir });

if (allowMatchers.some((matcher) => matcher(normalizedImportPath)
    || matcher(parsedImport.path))) {
    return;
}
```

For module specifiers, remove `rootDir` only when it is the first segment:

```js
function stripRootDir(value, rootDir = 'src') {
    const segments = getPathSegments(value);
    const rootSegments = getRootSegments(rootDir);

    if (!segments || !rootSegments || !hasSegmentSequence(segments, rootSegments, 0)) {
        return null;
    }

    return segments.slice(rootSegments.length).join('/') || null;
}
```

The production implementation is in
[lib/helpers/helpers.js](../../../lib/helpers/helpers.js) and is used by
[shared-public-api-imports](../../../lib/rules/shared-public-api-imports.js).
`extractPathFromRoot()` remains the generic parser helper for filenames,
resolved targets, and rules whose import parsing intentionally accepts a root
segment after a path prefix; `shared-public-api-imports` deliberately uses the
leading-only helper instead.

## Why This Works

A filename can contain `rootDir` after an arbitrary absolute-path prefix, so
an any-segment search is appropriate there. A module specifier is already a
logical namespace: stripping `rootDir` outside its leading segment changes its
identity and can turn an external dependency into a local import.

`normalizeSeparators()` makes slash and backslash forms comparable, while
`stripAlias()` removes only a complete leading alias segment. The combination
preserves external namespaces and lets configured exceptions match local FSD
paths consistently.

## Prevention

- Test alias and non-alias forms for every alias-aware allow or ignore option.
- Test slash and backslash forms for relative-import glob patterns.
- Keep a negative regression for package-like specifiers containing `rootDir`.
- Test rule documentation examples as parseable JavaScript and test the
  published ESLint configuration shape in the compatibility workflow.

Relevant regressions live in
[tests/lib/rules/forbidden-app-imports.js](../../../tests/lib/rules/forbidden-app-imports.js),
[tests/lib/rules/no-cross-slice-relative-imports.js](../../../tests/lib/rules/no-cross-slice-relative-imports.js),
and [tests/lib/rules/shared-public-api-imports.js](../../../tests/lib/rules/shared-public-api-imports.js).

## Related Issues

- None found when this learning was written.
