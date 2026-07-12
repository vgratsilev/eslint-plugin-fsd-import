# Slice-boundaries overlap policy

`slice-boundaries` prevents imports of another slice's public API within the
same configured FSD layer. It is intentionally diagnostic-only.

| Import form | Boundary decision | Owning rule when combined |
| --- | --- | --- |
| Same-slice import | Allowed | None |
| Absolute or alias public API (`entities/User`) across slices | Reported | `slice-boundaries` |
| Absolute or alias deep import (`entities/User/model`) | Reported | `public-api-imports` |
| Relative cross-slice import | Reported | `no-cross-slice-relative-imports` |
| Testing public API from a matching test file | Allowed when configured | None |

The generic rule therefore ignores relative imports and deep absolute imports.
Those cases are still protected by their specialized rules when they are
enabled, and a combined configuration produces one diagnostic per import.
