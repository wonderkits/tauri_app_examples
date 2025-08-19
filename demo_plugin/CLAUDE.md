# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

- `npm run dev` - 启动开发服务器，端口3001，支持host访问
- `npm run build` - 构建应用（TypeScript编译 + Vite构建）
- `npm run preview` - 预览构建后的应用，端口3001

## 项目架构

这是一个Wujie微前端子应用，可以独立运行，也可以作为微前端子应用运行。项目使用React 19、TypeScript和Vite，采用基于文件的路由系统。

### 核心架构模式

**双模式运行**：应用通过 `window.__POWERED_BY_WUJIE__` 检测运行时环境并相应调整行为。作为微前端运行时，使用Wujie通信总线进行父子应用间的消息传递。

**基于文件的路由**：使用 `vite-plugin-pages` 从 `src/pages/` 目录自动生成路由。路由会动态添加package.json中 `name` 字段作为前缀（当前为 `/demo`）。vite.config.ts中的路由配置从 `pkg.name` 读取前缀。

**布局系统**：提供三种布局类型：

- `DefaultLayout` - 标准布局，包含导航和玻璃态样式
- `SimpleLayout` - 极简布局，无导航
- `FullscreenLayout` - 全视口布局

**Wonderkits集成**：使用 `@wonderkits/app` 和 `@wonderkits/client` 包。应用配置定义在 `src/app/providers/app.config.ts` 中，包含清单、导航和Wujie特定设置。

### 通信架构

**Wujie集成**：`useWujieIntegration` 钩子处理：

- 环境检测
- 通过 `window.$wujie.props` 访问父应用属性
- 使用 `window.$wujie.bus` 进行双向消息传递
- 向父应用通知路由变化

**消息流**：子到父消息使用事件名 `child-message`，父到子使用 `parent-to-child`。所有消息都包含时间戳和发送者标识等元数据。

### 样式和UI

使用Tailwind CSS 4，具有自定义渐变背景和玻璃态效果。Navigation组件动态构建带应用前缀的路由，并包含活动路由的视觉指示器。

### 服务集成

应用包含各种服务的演示页面：

- SQL数据库操作 (`/sql`)
- 文件系统操作 (`/fs`)
- 键值存储操作 (`/store`)

每个服务页面都遵循状态指示器、操作模板和结果显示的模式。

## 重要配置说明

**CORS设置**：Vite开发服务器配置了宽松的CORS头，以支持从不同源加载微前端。

**构建优化**：为Wujie兼容性自定义资源文件命名，分离CSS、JS和图片资源。

**动态路由前缀**：vite-plugin-pages配置和Navigation组件都从package.json的name字段读取路由前缀，确保构建时和运行时路由的一致性。