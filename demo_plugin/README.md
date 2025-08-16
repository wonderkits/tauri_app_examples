# Demo子应用

这是一个用于演示Wujie微前端架构的子应用。

## 功能特性

- 🎯 **双模式运行**: 可以独立运行，也可以作为Wujie子应用运行
- 📡 **应用间通信**: 支持与父应用的双向通信
- 🎮 **交互演示**: 包含计数器等交互功能
- 🌍 **环境检测**: 自动检测运行环境并显示相关信息
- 📋 **Props展示**: 显示父应用传递的属性

## 开发和运行

### 独立运行
```bash
npm install
npm run dev
```

访问 http://localhost:3001 查看独立运行的子应用。

### 作为Wujie子应用运行
1. 启动子应用服务器：
   ```bash
   npm run dev
   ```

2. 在主应用中访问Demo应用页面
3. 切换到"Wujie模式"即可看到子应用被加载

## 技术栈

- React 19
- TypeScript
- Vite
- Wujie微前端框架

## 文件结构

```
src/
├── App.tsx          # 主应用组件
├── main.tsx         # 应用入口
└── vite-env.d.ts    # TypeScript类型声明
```

## Wujie集成要点

1. **环境检测**: 通过 `window.__POWERED_BY_WUJIE__` 检测是否在Wujie环境中
2. **Props获取**: 通过 `window.$wujie.props` 获取父应用传递的属性  
3. **消息通信**: 使用 `window.$wujie.bus` 进行应用间通信
4. **CORS配置**: Vite配置了适当的CORS头以支持跨域加载

## 通信示例

```typescript
// 向父应用发送消息
window.$wujie?.bus.$emit('child-message', {
  from: 'demo-child',
  message: 'Hello Parent!',
  timestamp: new Date().toISOString()
});

// 监听父应用消息
window.$wujie?.bus.$on('parent-to-child', (data) => {
  console.log('收到父应用消息:', data);
});
```