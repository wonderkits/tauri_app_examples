import { Link, useLocation } from 'react-router-dom';
import {name as pkgName} from '../../../package.json';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  style?: React.CSSProperties;
}

const BASE_PREFIX = `/${pkgName}`;

const baseNavItems: NavItem[] = [
  { path: '', label: '首页', icon: '🏠' },
  { path: '/about', label: '关于', icon: 'ℹ️' },
  { path: '/features', label: '功能', icon: '⚡' },
  { 
    path: '/sql', 
    label: 'SQL数据库', 
    icon: '🗄️',
    style: {
      border: '1px solid rgba(16, 185, 129, 0.5)'
    }
  },
  { 
    path: '/fs', 
    label: '文件系统', 
    icon: '📁',
    style: {
      border: '1px solid rgba(59, 130, 246, 0.5)'
    }
  },
  { 
    path: '/store', 
    label: '键值存储', 
    icon: '💾',
    style: {
      border: '1px solid rgba(139, 92, 246, 0.5)'
    }
  },
  { 
    path: '/tailwind-test', 
    label: 'Tailwind测试', 
    icon: '🎨',
    style: {
      border: '1px solid rgba(236, 72, 153, 0.5)'
    }
  }
];

const navItems: NavItem[] = baseNavItems.map(item => ({
  ...item,
  path: item.path === '' ? BASE_PREFIX : `${BASE_PREFIX}${item.path}`
}));

export const Navigation = () => {
  const location = useLocation();

  const getNavItemStyle = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const borderValue = item.style?.border;
    const glowColor = typeof borderValue === 'string' 
      ? borderValue.match(/rgba\([^)]+\)/)?.[0] || 'rgba(255,255,255,0.3)'
      : 'rgba(255,255,255,0.3)';
    
    return {
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      transition: 'all 0.3s ease',
      boxShadow: isActive && borderValue 
        ? `0 0 8px ${glowColor}` 
        : 'none',
      ...item.style
    };
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '32px',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      flexWrap: 'wrap'
    }}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={getNavItemStyle(item)}
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </nav>
  );
};