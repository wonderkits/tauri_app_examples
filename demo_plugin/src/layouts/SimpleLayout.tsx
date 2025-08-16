import type { LayoutProps } from '../types/layout';

export const SimpleLayout = ({ children }: LayoutProps) => {
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh',
      background: '#f5f5f5',
      color: '#333'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {children}
      </div>
    </div>
  );
};