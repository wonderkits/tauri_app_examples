interface KeyValueOperationsProps {
  currentKey: string;
  currentValue: string;
  loading: boolean;
  onKeyChange: (key: string) => void;
  onValueChange: (value: string) => void;
  onSetValue: () => void;
  onGetValue: () => void;
  onDeleteKey: () => void;
  onClearStore: () => void;
}

export const KeyValueOperations = ({
  currentKey,
  currentValue,
  loading,
  onKeyChange,
  onValueChange,
  onSetValue,
  onGetValue,
  onDeleteKey,
  onClearStore,
}: KeyValueOperationsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white mb-3 text-xl font-semibold">
        💻 键值操作界面
      </h3>
      <div className="bg-white/10 rounded-lg p-4">
        {/* 键输入 */}
        <div className="mb-4">
          <label className="block text-white mb-1 text-sm">
            键名:
          </label>
          <input
            type="text"
            value={currentKey}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder="输入键名..."
            className="w-full px-3 py-2 rounded-md border border-white/30 bg-black/30 text-white text-sm placeholder:text-white/50"
          />
        </div>

        {/* 值编辑 */}
        <div className="mb-4">
          <label className="block text-white mb-1 text-sm">
            值 (支持字符串或 JSON):
          </label>
          <textarea
            value={currentValue}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="输入值（字符串或 JSON 格式）..."
            className="w-full h-24 px-3 py-2 rounded-md border border-white/30 bg-black/30 text-white text-xs font-mono resize-y placeholder:text-white/50"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onSetValue}
            disabled={!currentKey || loading}
            className="bg-blue-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-600 transition-colors"
          >
            💾 设置值
          </button>
          <button
            onClick={onGetValue}
            disabled={!currentKey || loading}
            className="bg-emerald-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-600 transition-colors"
          >
            📖 获取值
          </button>
          <button
            onClick={onDeleteKey}
            disabled={!currentKey || loading}
            className="bg-red-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-red-600 transition-colors"
          >
            🗑️ 删除键
          </button>
          <button
            onClick={onClearStore}
            disabled={loading}
            className="bg-amber-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-600 transition-colors"
          >
            🧹 清空 Store
          </button>
        </div>
      </div>
    </div>
  );
};