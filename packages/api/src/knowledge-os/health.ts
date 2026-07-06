import { isKnowledgeOsEnabled, type KnowledgeOSEnv } from './config';

export const KNOWLEDGE_OS_PHASE = 'foundation';

export const KNOWLEDGE_OS_REQUIRED_TABLES = [
  'knowledge_spaces',
  'knowledge_documents',
  'knowledge_document_versions',
  'knowledge_acl',
  'knowledge_audit_log',
] as const;

export type KnowledgeOSTable = (typeof KNOWLEDGE_OS_REQUIRED_TABLES)[number];

export type KnowledgeOSHealth = {
  enabled: boolean;
  module: 'knowledge-os';
  phase: typeof KNOWLEDGE_OS_PHASE;
  schema: Record<KnowledgeOSTable, boolean>;
  rag: {
    available: false;
    reason: string;
  };
  qwen: {
    available: false;
    reason: string;
  };
};

export function getKnowledgeOsHealth({
  env = process.env,
}: {
  env?: KnowledgeOSEnv;
} = {}): KnowledgeOSHealth {
  const schema = Object.fromEntries(
    KNOWLEDGE_OS_REQUIRED_TABLES.map((table) => [table, true]),
  ) as Record<KnowledgeOSTable, boolean>;

  return {
    enabled: isKnowledgeOsEnabled(env),
    module: 'knowledge-os',
    phase: KNOWLEDGE_OS_PHASE,
    schema,
    rag: {
      available: false,
      reason: 'not implemented in Phase 1',
    },
    qwen: {
      available: false,
      reason: 'not implemented in Phase 1',
    },
  };
}
