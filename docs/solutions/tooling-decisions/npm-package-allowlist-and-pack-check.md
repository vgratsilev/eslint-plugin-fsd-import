---
title: Explicit npm package allowlist with pack verification
date: 2026-07-13
category: docs/solutions/tooling-decisions
module: npm package publishing
problem_type: tooling_decision
component: tooling
severity: low
applies_when:
  - A repository publishes an npm package from a source tree that also contains tests, plans, CI files, or internal documentation.
  - Package contents need a repeatable check before npm publish.
tags:
  - npm
  - package-publishing
  - release-hygiene
  - ci-verification
---

# Explicit npm package allowlist with pack verification

## Context

Without a `files` allowlist, npm used the repository's broad default file selection. The package dry run included 44 files, including tests, CI configuration, plans, internal solution notes, and roadmap artifacts that are not part of the consumer-facing plugin.

## Guidance

Declare the public package surface in `package.json` with a positive allowlist. This repository publishes only `lib`, `docs/rules`, `README.md`, and `CHANGELOG.md`; npm adds `package.json` automatically.

Keep the allowlist separate from the repository's development files. An empty or incidental `.npmignore` should not be the primary release contract.

Add a verifier that runs `npm pack --dry-run --json`, rejects every path outside the allowlist, and checks required entrypoints and documentation. Expose it as a separate npm script and run it in CI so package-surface regressions are detected before publishing.

The implementation lives in [package.json](../../../package.json), [scripts/verify-package.js](../../../scripts/verify-package.js), and [.github/workflows/compatibility.yml](../../../.github/workflows/compatibility.yml).

## Why This Matters

The npm archive is a public interface. An explicit allowlist prevents internal repository structure from becoming accidental package content, while `npm pack --dry-run --json` verifies the actual archive selection rather than only inspecting configuration.

The verifier currently confirms a 22-file package containing only the declared runtime code, rule documentation, release notes, README, and package metadata.

## When to Apply

- When adding new repository directories that should remain internal.
- When changing the package entrypoint or adding publishable documentation.
- Before releasing a package after adding tests, plans, CI files, or development tooling.

## Examples

The package check passes when a new file is added under `tests/` because that file remains outside the published archive. It fails only when `npm pack` actually includes an unexpected path or omits a required path.

The repository's package check is available as `npm run test:package` and is executed alongside the ESLint compatibility check in CI.

## Related

- [Roadmap release-hygiene guidance](../../../ROADMAP.md)
- [Canonical import path normalization](../logic-errors/canonical-import-path-normalization.md)
