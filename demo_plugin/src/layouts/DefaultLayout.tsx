import { Navigation } from '../components/Navigation';
import type { LayoutProps } from '../types/layout';

export const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <div style={{ 
      padding: '24px', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 标题 */}
        <h1 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🎯 Wujie子应用演示
        </h1>

        {/* 导航菜单 */}
        <Navigation />

        {/* 页面内容区域 */}
        <div style={{ marginBottom: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};