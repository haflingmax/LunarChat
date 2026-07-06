# Publication Readiness

This repository is a long-lived fork of LibreChat. Changes should be safe for
a future public GitHub release unless explicitly marked internal and kept out
of Git.

## Public-Safe Rules

- Do not commit secrets, tokens, private keys, production URLs, internal IPs,
  customer data, employee data, local machine paths, or private source-control
  references.
- Keep deployment-only configuration outside this product repository.
- Keep local planning and internal documentation outside tracked files unless
  explicitly approved for public release.
- Preserve upstream license and attribution material.
- Do not imply official ClickHouse, LibreChat, or OpenAI affiliation.

## Commit Gate

Before every commit:

1. Run deterministic staged-diff checks.
2. Run independent publication-safety reviews.
3. Record a local review marker only after the final consolidated verdict is pass.
4. Commit without bypassing hooks.

This repository uses Husky. The publication-safety gate is part of
`.husky/pre-commit`; do not replace Husky with another `core.hooksPath`.

If a checkout does not run Husky hooks, install the compatibility hook:

```sh
git config core.hooksPath .githooks
```

Organization-specific scanner patterns belong in the ignored local overlay
`scripts/publication-safety/config.local.json`, not in tracked files.
Tracked and local scanner configs may only add stricter blocked-path or
blocked-content rules; allowlisted placeholders are owned by the scanner code.
