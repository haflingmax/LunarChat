import { useKnowledgeOSHealthQuery } from '~/data-provider';
import { useLocalize } from '~/hooks';

export default function KnowledgeOSPanel() {
  const localize = useLocalize();
  const { data, isLoading, isError } = useKnowledgeOSHealthQuery();

  const schemaReady =
    data?.schema != null && Object.values(data.schema).length > 0
      ? Object.values(data.schema).every(Boolean)
      : false;

  return (
    <div className="h-auto w-full px-3 pb-3 pt-2">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-text-primary">
          {localize('com_ui_knowledge_os')}
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          {isLoading
            ? localize('com_ui_loading')
            : isError
              ? localize('com_ui_error')
              : data?.enabled
                ? localize('com_ui_enabled')
                : localize('com_ui_disabled')}
        </p>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border-light pb-2">
          <dt className="text-text-secondary">{localize('com_ui_status')}</dt>
          <dd className="text-right text-text-primary">
            {data?.phase ?? localize('com_ui_unavailable')}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border-light pb-2">
          <dt className="text-text-secondary">{localize('com_ui_database')}</dt>
          <dd className="text-right text-text-primary">
            {schemaReady ? localize('com_ui_ready') : localize('com_ui_unavailable')}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border-light pb-2">
          <dt className="text-text-secondary">RAG</dt>
          <dd className="text-right text-text-primary">
            {data?.rag.available ? localize('com_ui_ready') : localize('com_ui_unavailable')}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-secondary">Qwen</dt>
          <dd className="text-right text-text-primary">
            {data?.qwen.available ? localize('com_ui_ready') : localize('com_ui_unavailable')}
          </dd>
        </div>
      </dl>
    </div>
  );
}
