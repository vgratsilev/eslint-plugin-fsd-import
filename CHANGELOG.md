# Changelog

## 0.1.1

* Restrict the published npm package to the consumer-facing runtime and
  documentation files.
* Add npm package-content verification and run it in the compatibility CI.

## 0.1.0

* Add root-aware FSD path parsing and Windows/Unix fixture coverage.
* Add cross-slice, shared public API, app-boundary, deprecated-layer, and
  slice-boundary rules.
* Add legacy and flat recommended configurations. `public-api-imports` remains
  opt-in because its testing exceptions are project-specific.
* Reject invalid and misspelled rule options instead of silently ignoring them.
