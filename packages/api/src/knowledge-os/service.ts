import { getKnowledgeOsHealth, type KnowledgeOSHealth } from './health';
import type { KnowledgeOSEnv } from './config';

export class KnowledgeOSService {
  getHealth(env: KnowledgeOSEnv = process.env): KnowledgeOSHealth {
    return getKnowledgeOsHealth({ env });
  }
}

export const knowledgeOSService: KnowledgeOSService = new KnowledgeOSService();
