export const KNOWLEDGE_OS_PHASE1_TABLES = [
  'knowledge_spaces',
  'knowledge_documents',
  'knowledge_document_versions',
  'knowledge_acl',
  'knowledge_audit_log',
] as const;

export type KnowledgeOSPhase1Table = (typeof KNOWLEDGE_OS_PHASE1_TABLES)[number];

export const knowledgeOSSchema = {
  knowledge_spaces: {
    columns: [
      'id',
      'name',
      'slug',
      'description',
      'created_by_user_id',
      'created_at',
      'updated_at',
      'archived_at',
    ],
  },
  knowledge_documents: {
    columns: [
      'id',
      'space_id',
      'title',
      'slug',
      'document_type',
      'status',
      'created_by_user_id',
      'updated_by_user_id',
      'created_at',
      'updated_at',
    ],
  },
  knowledge_document_versions: {
    columns: [
      'id',
      'document_id',
      'version_number',
      'content_markdown',
      'source_file_id',
      'status',
      'created_by_user_id',
      'published_by_user_id',
      'created_at',
      'published_at',
      'immutable',
    ],
  },
  knowledge_acl: {
    columns: [
      'id',
      'resource_type',
      'resource_id',
      'principal_type',
      'principal_id',
      'permission',
      'effect',
      'created_by_user_id',
      'created_at',
    ],
  },
  knowledge_audit_log: {
    columns: [
      'id',
      'occurred_at',
      'actor_user_id',
      'action',
      'resource_type',
      'resource_id',
      'metadata',
    ],
  },
} as const satisfies Record<KnowledgeOSPhase1Table, { columns: readonly string[] }>;
