import { ComponentType, ReactNode } from 'react';

// Layout 组件接口
export interface LayoutProps {
  children: ReactNode;
}

// Layout 组件类型
export type LayoutComponent = ComponentType<LayoutProps>;

// 页面配置接口
export interface PageConfig {
  layout?: string | LayoutComponent;
  title?: string;
  description?: string;
  requiresAuth?: boolean;
}

// 扩展页面组件类型，支持 Layout 配置
export interface PageComponentWithConfig {
  (): ReactNode;
  config?: PageConfig;
}