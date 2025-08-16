import { OperationTemplate } from '../../../types';

interface FsOperationTemplatesProps {
  templates: OperationTemplate[];
  loading: boolean;
}

export const FsOperationTemplates = ({ templates, loading }: FsOperationTemplatesProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white mb-3 text-xl font-semibold">
        📋 文件操作模板
      </h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={template.action}
            disabled={loading}
            className={`
              bg-white/15 border border-white/20 rounded-md text-white 
              px-3 py-2 text-xs text-left transition-all duration-200
              hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};