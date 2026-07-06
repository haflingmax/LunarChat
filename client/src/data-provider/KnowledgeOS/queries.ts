import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, dataService } from 'librechat-data-provider';
import type { QueryObserverResult, UseQueryOptions } from '@tanstack/react-query';
import type t from 'librechat-data-provider';
import store from '~/store';

export const useKnowledgeOSHealthQuery = (
  config?: UseQueryOptions<t.TKnowledgeOSHealthResponse>,
): QueryObserverResult<t.TKnowledgeOSHealthResponse> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<t.TKnowledgeOSHealthResponse>(
    [QueryKeys.knowledgeOSHealth],
    () => dataService.getKnowledgeOSHealth(),
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      ...config,
      enabled: (config?.enabled ?? true) === true && queriesEnabled,
    },
  );
};
