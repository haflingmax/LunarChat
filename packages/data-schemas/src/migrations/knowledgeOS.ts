export const KNOWLEDGE_OS_PHASE1_MIGRATION_ID = '001_knowledge_os_foundation';

export const KNOWLEDGE_OS_PHASE1_MIGRATION_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS knowledge_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES knowledge_spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'markdown',
  status TEXT NOT NULL DEFAULT 'draft',
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (space_id, slug)
);

CREATE TABLE IF NOT EXISTS knowledge_document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_markdown TEXT,
  source_file_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by_user_id TEXT NOT NULL,
  published_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  immutable BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT knowledge_document_versions_version_positive_check CHECK (version_number > 0),
  CONSTRAINT knowledge_document_versions_published_immutable_check
    CHECK (published_at IS NULL OR immutable = true),
  UNIQUE (document_id, version_number)
);

CREATE TABLE IF NOT EXISTS knowledge_acl (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  principal_type TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  permission TEXT NOT NULL,
  effect TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT knowledge_acl_effect_check CHECK (effect IN ('allow', 'deny')),
  UNIQUE (resource_type, resource_id, principal_type, principal_id, permission)
);

CREATE TABLE IF NOT EXISTS knowledge_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS knowledge_documents_space_status_idx
  ON knowledge_documents (space_id, status);

CREATE INDEX IF NOT EXISTS knowledge_document_versions_document_idx
  ON knowledge_document_versions (document_id, version_number DESC);

CREATE INDEX IF NOT EXISTS knowledge_acl_resource_idx
  ON knowledge_acl (resource_type, resource_id, permission, effect);

CREATE INDEX IF NOT EXISTS knowledge_audit_log_resource_idx
  ON knowledge_audit_log (resource_type, resource_id, occurred_at DESC);
`;
