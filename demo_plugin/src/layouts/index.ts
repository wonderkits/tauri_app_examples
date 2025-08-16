import { DefaultLayout } from './DefaultLayout';
import { SimpleLayout } from './SimpleLayout';
import { FullscreenLayout } from './FullscreenLayout';
import type { LayoutComponent } from '../types/layout';

// 预定义的布局组件映射
export const layouts: Record<string, LayoutComponent> = {
  default: DefaultLayout,
  simple: SimpleLayout,
  fullscreen: FullscreenLayout,
};

// 获取布局组件的函数
export const getLayout = (layoutName?: string | LayoutComponent): LayoutComponent => {
  // 如果直接传入组件，则返回该组件
  if (typeof layoutName === 'function') {
    return layoutName;
  }
  
  // 如果传入字符串，从预定义布局中获取
  if (typeof layoutName === 'string' && layouts[layoutName]) {
    return layouts[layoutName];
  }
  
  // 默认返回 DefaultLayout
  return layouts.default;
};

// 导出所有布局组件
export {
  DefaultLayout,
  SimpleLayout,
  FullscreenLayout,
};

// 导出类型
export type { LayoutProps, LayoutComponent, PageConfig, PageComponentWithConfig } from '../types/layout';