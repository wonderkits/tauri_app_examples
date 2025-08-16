export const InitializingView = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      color: 'rgba(255, 255, 255, 0.6)'
    }}>
      <h3>⏳ SQL 数据库服务初始化中...</h3>
      <p>请稍等，服务将自动就绪</p>
      <p style={{ fontSize: '14px', marginTop: '20px' }}>
        💡 自动检测运行环境：
        <br />
        • Tauri 应用中使用原生 SQL 插件
        <br />
        • 独立开发中使用 HTTP SQL 服务
      </p>
    </div>
  );
};