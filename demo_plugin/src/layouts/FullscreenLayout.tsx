import type { LayoutProps } from '../types/layout';

export const FullscreenLayout = ({ children }: LayoutProps) => {
  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      background: '#000',
      color: '#fff',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  );
};