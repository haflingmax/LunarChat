export type KnowledgeOSEnv = {
  ENABLE_KNOWLEDGE_OS?: string | boolean | null;
};

export function isKnowledgeOsEnabled(env: KnowledgeOSEnv = process.env): boolean {
  const rawValue = env.ENABLE_KNOWLEDGE_OS;
  if (typeof rawValue === 'boolean') {
    return rawValue;
  }
  if (typeof rawValue !== 'string') {
    return false;
  }
  const value = rawValue.trim().toLowerCase();
  return value === 'true' || value === '1';
}
