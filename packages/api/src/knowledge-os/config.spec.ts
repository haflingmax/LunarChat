import { isKnowledgeOsEnabled } from './config';

describe('Knowledge OS feature flag', () => {
  it.each([
    [undefined, false],
    ['', false],
    ['false', false],
    ['0', false],
    ['true', true],
    ['1', true],
    ['TRUE', true],
  ])('resolves ENABLE_KNOWLEDGE_OS=%p to %p', (value, expected) => {
    expect(isKnowledgeOsEnabled({ ENABLE_KNOWLEDGE_OS: value })).toBe(expected);
  });
});
