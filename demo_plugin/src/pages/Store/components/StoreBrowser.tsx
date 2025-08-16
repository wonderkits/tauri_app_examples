interface StoreBrowserProps {
  storeEntries: [string, any][];
  loading: boolean;
  onRefreshEntries: () => void;
  onSelectEntry: (key: string, value: any) => void;
}

export const StoreBrowser = ({
  storeEntries,
  loading,
  onRefreshEntries,
  onSelectEntry,
}: StoreBrowserProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white mb-3 text-xl font-semibold">
        📂 Store 内容浏览
      </h3>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={onRefreshEntries}
            disabled={loading}
            className="bg-emerald-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-600 transition-colors"
          >
            🔄 刷新内容
          </button>
          <span className="text-white/80 text-sm flex items-center">
            共 {storeEntries.length} 个条目
          </span>
        </div>

        {storeEntries.length > 0 ? (
          <div className="bg-black/20 rounded-md p-3 max-h-60 overflow-y-auto">
            {storeEntries.map(([key, value], index) => (
              <div
                key={index}
                className={`flex items-start gap-3 py-2 ${index < storeEntries.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <span 
                  className="text-blue-500 text-xs font-mono font-bold min-w-[120px] cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => onSelectEntry(key, value)}
                >
                  {key}:
                </span>
                <span className="text-white/90 text-xs font-mono flex-1 whitespace-pre-wrap break-words">
                  {typeof value === 'string' 
                    ? `"${value}"` 
                    : JSON.stringify(value, null, 2)
                  }
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-5 text-sm">
            Store 为空，点击上方模板或手动添加键值对
          </div>
        )}
      </div>
    </div>
  );
};