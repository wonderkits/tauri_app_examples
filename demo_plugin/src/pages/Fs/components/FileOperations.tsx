interface FileOperationsProps {
  currentPath: string;
  fileContent: string;
  loading: boolean;
  onPathChange: (path: string) => void;
  onContentChange: (content: string) => void;
  onWriteFile: () => void;
  onReadFile: () => void;
}

export const FileOperations = ({
  currentPath,
  fileContent,
  loading,
  onPathChange,
  onContentChange,
  onWriteFile,
  onReadFile,
}: FileOperationsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white mb-3 text-xl font-semibold">
        💻 文件操作界面
      </h3>
      <div className="bg-white/10 rounded-lg p-4">
        {/* 路径输入 */}
        <div className="mb-4">
          <label className="block text-white mb-1 text-sm">
            文件路径:
          </label>
          <input
            type="text"
            value={currentPath}
            onChange={(e) => onPathChange(e.target.value)}
            placeholder="输入文件路径..."
            className="w-full px-3 py-2 rounded-md border border-white/30 bg-black/30 text-white text-sm placeholder:text-white/50"
          />
        </div>

        {/* 文件内容编辑 */}
        <div className="mb-4">
          <label className="block text-white mb-1 text-sm">
            文件内容:
          </label>
          <textarea
            value={fileContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="输入文件内容..."
            className="w-full h-24 px-3 py-2 rounded-md border border-white/30 bg-black/30 text-white text-xs font-mono resize-y placeholder:text-white/50"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onWriteFile}
            disabled={loading}
            className="bg-blue-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-600 transition-colors"
          >
            💾 写入文件
          </button>
          <button
            onClick={onReadFile}
            disabled={loading}
            className="bg-emerald-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-600 transition-colors"
          >
            📖 读取文件
          </button>
        </div>
      </div>
    </div>
  );
};