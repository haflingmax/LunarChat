export const KNOWLEDGE_OS_SECURITY_INVARIANTS = [
  'If user cannot read document, RAG cannot retrieve its chunks.',
  'If document is not published, ordinary user RAG cannot use it.',
  'If source fails backend ACL check, it cannot be shown in citations.',
  'Frontend permissions are not security.',
  'Published versions are immutable.',
  'Citations are backend-rendered.',
] as const;
