import { knowledgeOSHealth } from './api-endpoints';
import { QueryKeys } from './keys';

describe('Knowledge OS data provider surface', () => {
  it('defines the Phase 1 health endpoint path', () => {
    expect(knowledgeOSHealth()).toBe('/api/knowledge-os/health');
  });

  it('defines a dedicated React Query key for health status', () => {
    expect(QueryKeys.knowledgeOSHealth).toBe('knowledgeOSHealth');
  });
});
