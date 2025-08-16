interface ConnectionStatusProps {
  connected: boolean;
  clientMode: string;
  storeFilename: string;
  onStoreFilenameChange: (filename: string) => void;
}

export const ConnectionStatus = ({ 
  connected, 
  clientMode, 
  storeFilename, 
  onStoreFilenameChange 
}: ConnectionStatusProps) => {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 mb-6 p-4 bg-white/10 rounded-lg">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className={`w-2.5 h-2.5 rounded-full inline-block ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          <span className="text-white font-bold">
            {connected ? '已连接' : '未连接'}
          </span>
          {connected && (
            <span className="text-white/80 text-sm">
              模式: {clientMode}
            </span>
          )}
        </div>
        
        <input
          type="text"
          value={storeFilename}
          onChange={(e) => onStoreFilenameChange(e.target.value)}
          disabled={connected}
          placeholder="Store 文件名 (例如: settings.json)"
          className="w-full px-3 py-2 rounded-md border border-white/30 bg-white/10 text-white text-sm placeholder:text-white/50 disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
      
      <div className="flex gap-2 items-end">
        <div className="flex items-center gap-3 text-white text-sm">
          <span className={`w-2 h-2 rounded-full inline-block ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          键值存储服务: {connected ? '已就绪' : '初始化中...'}
          {connected && (
            <span className="opacity-80 text-xs">
              ({clientMode})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};