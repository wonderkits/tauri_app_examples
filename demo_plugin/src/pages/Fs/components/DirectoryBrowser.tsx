import { type DirEntry } from '@wonderkits/client';

interface DirectoryBrowserProps {
  currentDir: string;
  dirEntries: DirEntry[];
  loading: boolean;
  onDirChange: (dir: string) => void;
  onReadDirectory: () => void;
}

export const DirectoryBrowser = ({
  currentDir,
  dirEntries,
  loading,
  onDirChange,
  onReadDirectory,
}: DirectoryBrowserProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white mb-3 text-xl font-semibold">
        📂 目录浏览
      </h3>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentDir}
            onChange={(e) => onDirChange(e.target.value)}
            placeholder="输入目录路径..."
            className="flex-1 px-3 py-2 rounded-md border border-white/30 bg-black/30 text-white text-sm placeholder:text-white/50"
          />
          <button
            onClick={onReadDirectory}
            disabled={loading}
            className="bg-emerald-500 border-none rounded-md text-white px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-600 transition-colors"
          >
            📂 读取目录
          </button>
        </div>

        {dirEntries.length > 0 && (
          <div className="bg-black/20 rounded-md p-3 max-h-48 overflow-y-auto">
            {dirEntries.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 py-1 ${index < dirEntries.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <span className="text-base">
                  {entry.is_dir ? '📁' : '📄'}
                </span>
                <span className="text-white text-xs font-mono flex-1">
                  {entry.name}
                </span>
                <span className="text-white/60 text-xs">
                  {entry.is_dir ? 'DIR' : `${entry.size} bytes`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};