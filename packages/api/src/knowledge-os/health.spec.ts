import {
  KNOWLEDGE_OS_PHASE,
  KNOWLEDGE_OS_REQUIRED_TABLES,
  getKnowledgeOsHealth,
} from './health';

describe('Knowledge OS health', () => {
  it('reports disabled state without claiming RAG or model role availability', () => {
    const health = getKnowledgeOsHealth({ env: { ENABLE_KNOWLEDGE_OS: 'false' } });

    expect(health).toEqual(
      expect.objectContaining({
        enabled: false,
        module: 'knowledge-os',
        phase: KNOWLEDGE_OS_PHASE,
      }),
    );
    expect(health.rag).toEqual({
      available: false,
      reason: 'not implemented in Phase 1',
    });
    expect(health.qwen).toEqual({
      available: false,
      reason: 'not implemented in Phase 1',
    });
  });

  it('reports all Phase 1 schema tables when enabled', () => {
    const health = getKnowledgeOsHealth({ env: { ENABLE_KNOWLEDGE_OS: 'true' } });

    expect(health.enabled).toBe(true);
    expect(Object.keys(health.schema)).toEqual(KNOWLEDGE_OS_REQUIRED_TABLES);
    for (const table of KNOWLEDGE_OS_REQUIRED_TABLES) {
      expect(health.schema[table]).toBe(true);
    }
  });
});
