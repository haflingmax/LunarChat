const request = require('supertest');
const express = require('express');

const mockRequireJwtAuth = jest.fn((req, _res, next) => {
  req.user = { id: 'user-1', role: 'USER' };
  next();
});
const mockCheckBan = jest.fn((_req, _res, next) => next());
const mockUaParser = jest.fn((_req, _res, next) => next());

jest.mock('~/server/middleware', () => ({
  requireJwtAuth: (...args) => mockRequireJwtAuth(...args),
  checkBan: (...args) => mockCheckBan(...args),
  uaParser: (...args) => mockUaParser(...args),
}));

const mockIsKnowledgeOsEnabled = jest.fn();
const mockGetKnowledgeOsHealth = jest.fn();

jest.mock('@librechat/api', () => ({
  isKnowledgeOsEnabled: (...args) => mockIsKnowledgeOsEnabled(...args),
  getKnowledgeOsHealth: (...args) => mockGetKnowledgeOsHealth(...args),
}));

const knowledgeOSRoute = require('../knowledge-os');

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use('/api/knowledge-os', knowledgeOSRoute);
  return app;
}

describe('Knowledge OS routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetKnowledgeOsHealth.mockReturnValue({
      enabled: false,
      module: 'knowledge-os',
      phase: 'foundation',
      schema: {},
      rag: { available: false, reason: 'not implemented in Phase 1' },
      qwen: { available: false, reason: 'not implemented in Phase 1' },
    });
  });

  it('reports disabled health without requiring authentication', async () => {
    mockIsKnowledgeOsEnabled.mockReturnValue(false);

    const response = await request(createApp()).get('/api/knowledge-os/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.enabled).toBe(false);
    expect(mockRequireJwtAuth).not.toHaveBeenCalled();
  });

  it('requires authentication before reporting enabled health', async () => {
    mockIsKnowledgeOsEnabled.mockReturnValue(true);
    mockGetKnowledgeOsHealth.mockReturnValue({
      enabled: true,
      module: 'knowledge-os',
      phase: 'foundation',
      schema: { knowledge_spaces: true },
      rag: { available: false, reason: 'not implemented in Phase 1' },
      qwen: { available: false, reason: 'not implemented in Phase 1' },
    });

    const response = await request(createApp()).get('/api/knowledge-os/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.enabled).toBe(true);
    expect(mockRequireJwtAuth).toHaveBeenCalledTimes(1);
    expect(mockCheckBan).toHaveBeenCalledTimes(1);
    expect(mockUaParser).toHaveBeenCalledTimes(1);
  });

  it('does not call the service when enabled health auth fails', async () => {
    mockIsKnowledgeOsEnabled.mockReturnValue(true);
    mockRequireJwtAuth.mockImplementationOnce((_req, res) =>
      res.status(401).json({ error: 'Unauthorized' }),
    );

    const response = await request(createApp()).get('/api/knowledge-os/health');

    expect(response.statusCode).toBe(401);
    expect(mockGetKnowledgeOsHealth).not.toHaveBeenCalled();
  });
});
