import { KNOWLEDGE_OS_PHASE1_TABLES } from '../schema/knowledgeOS';
import { KNOWLEDGE_OS_PHASE1_MIGRATION_SQL } from './knowledgeOS';

describe('Knowledge OS PostgreSQL migration', () => {
  it('creates every Phase 1 table idempotently', () => {
    for (const table of KNOWLEDGE_OS_PHASE1_TABLES) {
      expect(KNOWLEDGE_OS_PHASE1_MIGRATION_SQL).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
  });

  it('enforces immutable published versions at the database boundary', () => {
    expect(KNOWLEDGE_OS_PHASE1_MIGRATION_SQL).toContain(
      'knowledge_document_versions_published_immutable_check',
    );
  });
});
