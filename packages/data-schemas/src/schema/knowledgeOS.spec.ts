import { KNOWLEDGE_OS_PHASE1_TABLES, knowledgeOSSchema } from './knowledgeOS';

describe('Knowledge OS schema manifest', () => {
  it('contains the Phase 1 PostgreSQL tables', () => {
    expect(KNOWLEDGE_OS_PHASE1_TABLES).toEqual([
      'knowledge_spaces',
      'knowledge_documents',
      'knowledge_document_versions',
      'knowledge_acl',
      'knowledge_audit_log',
    ]);
  });

  it('keeps published version immutability and ACL/RAG security fields explicit', () => {
    expect(knowledgeOSSchema.knowledge_document_versions.columns).toEqual(
      expect.arrayContaining(['id', 'document_id', 'version_number', 'content_markdown', 'published_at', 'immutable']),
    );
    expect(knowledgeOSSchema.knowledge_acl.columns).toEqual(
      expect.arrayContaining(['principal_type', 'principal_id', 'permission', 'effect']),
    );
    expect(knowledgeOSSchema.knowledge_audit_log.columns).toEqual(
      expect.arrayContaining(['actor_user_id', 'action', 'resource_type', 'resource_id']),
    );
  });
});
