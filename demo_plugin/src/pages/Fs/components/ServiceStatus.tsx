interface ServiceStatusProps {
  connected: boolean;
  clientMode: string;
}

export const ServiceStatus = ({ connected, clientMode }: ServiceStatusProps) => {
  return (
    <div className="mb-6 p-4 bg-white/10 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full inline-block ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        <span className="text-white font-bold">
          文件系统服务: {connected ? '已就绪' : '初始化中...'}
        </span>
        {connected && (
          <span className="text-white/80 text-sm">
            模式: {clientMode}
          </span>
        )}
      </div>
      
      <div className="text-white/80 text-sm">
        支持跨平台文件读写，自动检测运行环境（Tauri/HTTP）
      </div>
    </div>
  );
};