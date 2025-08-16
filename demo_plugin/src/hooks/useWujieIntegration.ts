import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface WujieState {
  isInWujie: boolean;
  parentProps: any;
  messages: string[];
}

export const useWujieIntegration = () => {
  const location = useLocation();
  const [state, setState] = useState<WujieState>({
    isInWujie: false,
    parentProps: null,
    messages: []
  });

  // 检查Wujie环境
  useEffect(() => {
    const inWujie = !!(window as any).__POWERED_BY_WUJIE__;
    setState(prev => ({ ...prev, isInWujie: inWujie }));

    if (inWujie && (window as any).$wujie) {
      const props = (window as any).$wujie.props;
      setState(prev => ({ ...prev, parentProps: props }));
      console.log('Wujie环境检测成功，父应用props:', props);
    }
  }, []);

  // 路由变化通知
  useEffect(() => {
    if (state.isInWujie && (window as any).$wujie?.bus) {
      (window as any).$wujie.bus.$emit('sub-route-change', {
        appId: 'demo',
        path: location.pathname,
        timestamp: Date.now()
      });
      console.log('子应用路由变化通知主应用:', location.pathname);
    }
  }, [location.pathname, state.isInWujie]);

  // 监听父应用消息
  useEffect(() => {
    if (state.isInWujie && (window as any).$wujie?.bus) {
      const handleParentMessage = (data: any) => {
        const msg = `收到父应用消息: ${JSON.stringify(data)}`;
        setState(prev => ({
          ...prev,
          messages: [...prev.messages.slice(-4), msg]
        }));
      };

      (window as any).$wujie.bus.$on('parent-to-child', handleParentMessage);

      return () => {
        (window as any).$wujie.bus.$off('parent-to-child', handleParentMessage);
      };
    }
  }, [state.isInWujie]);

  const sendMessageToParent = () => {
    if (state.isInWujie && (window as any).$wujie?.bus) {
      const message = `子应用消息 #${Date.now()}`;
      (window as any).$wujie.bus.$emit('child-message', {
        from: 'demo-child',
        message,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, `已发送: ${message}`]
      }));
    }
  };

  return {
    ...state,
    sendMessageToParent
  };
};