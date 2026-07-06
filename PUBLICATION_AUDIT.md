# LunarChat Public Release Audit

Status: internal audit, not a public release announcement.

## Blocking Before Public Release

- Secrets and credentials: high-signal scan completed; no confirmed real
  secrets found. Hits are scanner fixtures, unit-test fake keys, private-key
  test strings, and example Mongo/Postgres URLs. A full repository secret scan
  is still required before changing visibility.
- Internal domains and production URLs: high-signal scan completed; no confirmed
  company production domains, private server IPs, local workspace paths, or
  private source-control URLs found in tracked product files.
- Private documentation: `docs/` is ignored by default.
- License and attribution notices: pending full review.
- Branding and affiliation disclaimer: initial guardrail added in `PUBLICATION_READINESS.md`.
- Screenshots and generated assets: pending review.
- Docker examples and env examples: pending review.

## High-Signal Scan Notes

Commands run on July 6, 2026:

- Legacy/internal branding terms.
- Token, private-key, and bearer-token patterns.
- Private infrastructure indicators, local-machine paths, and private
  source-control references.
- Database connection-string patterns.

Reviewed hit classes:

- Publication-safety scanner rules and self-test fake tokens.
- Unit-test fixtures for GitHub tokens, OpenAI-like keys, CloudFront private
  keys, and PII filtering.
- Standard local/example MongoDB and PostgreSQL connection strings.
- RFC 1918 IP examples used by SSRF/domain-validation tests.

No mass cleanup was performed in this audit step.

## Current Decision

LunarChat remains private. This audit tracks work required before any future
visibility change.
