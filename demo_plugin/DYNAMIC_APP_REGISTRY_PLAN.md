# 动态子应用注册架构改造计划

## 项目背景

当前微前端架构存在双重配置问题：
- **主应用静态配置**: 需要在 `~/work/coder/magicteam/src/apps/demo/app.config.ts` 中预先配置
- **子应用注册**: 子应用还需要向 Rust 数据库注册中心注册

**目标**: 移除主应用中的静态配置文件，让子应用完全通过注册中心动态接入，实现真正的解耦微前端架构。

## 当前架构分析

### 主应用 (magicteam)
- **前端**: React + TypeScript，负责应用管理界面
- **后端**: Rust + Tauri，提供 App Registry 数据库服务
- **发现机制**: 通过 `import.meta.glob('../../apps/*/app.config.ts')` 扫描文件系统
- **状态管理**: AppRegistry (内存) + AppService + Zustand

### 子应用 (demo_plugin) 
- **架构**: React 微前端子应用
- **通信**: 通过 `@wonderkits/client` 与主应用 HTTP API 通信
- **注册**: 需要调用 `getAppRegistry().devRegisterApp()` 向数据库注册

### 关键问题
1. **双重维护**: 静态配置 + 数据库注册
2. **耦合度高**: 子应用必须在主应用代码库中有配置文件
3. **扩展性差**: 新增子应用需要修改主应用代码

## 开发环境 vs 生产环境注册机制

### 系统架构概览

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Tauri 主应用架构                              │
├─────────────────────┬───────────────────────────────────────────────┤
│    前端 (React)     │            后端 (Rust)                       │
│  - 应用管理界面      │  ┌─────────────────────────────────────────┐  │
│  - 微前端容器        │  │         HTTP Server                     │  │
│  - 导航和路由        │  │  ┌─────────────┬─────────────────────┐  │  │
│                     │  │  │ App Registry│    静态文件服务      │  │  │
│                     │  │  │    API      │  - 子应用资源服务    │  │  │
│                     │  │  │ (数据库)    │  - 打包文件托管     │  │  │
│                     │  │  └─────────────┴─────────────────────┘  │  │
└─────────────────────┴──┴─────────────────────────────────────────┴──┘
          ▲                              ▲
          │                              │
    ┌─────┴──────┐               ┌──────┴───────┐
    │  开发环境   │               │   生产环境    │
    │ 子应用服务器 │               │ 子应用打包文件 │
    │localhost:3001│               │/static/apps/ │
    └────────────┘               └──────────────┘
```

### 开发环境注册 (`devRegisterApp`)

**特点**:
- 子应用主动向注册中心注册开发服务器 URL
- 支持热重载和实时开发调试
- 注册信息包含 `dev_url` 字段（如 `http://localhost:3001/demo`）
- 应用状态可动态变化（上线/下线）

**流程**:
1. 子应用启动开发服务器（如 `npm run dev`）
2. WonderKits 客户端初始化，连接到主应用 HTTP API (localhost:1421)
3. 调用 `getAppRegistry().devRegisterApp(config, devUrl)` 注册
4. 主应用从数据库读取并动态加载子应用
5. 支持开发期间的配置更新和重新注册

**数据库存储**:
```sql
INSERT/UPDATE registered_apps (
  id, name, display_name, version, config_json,
  dev_url = 'http://localhost:3001/demo',  -- 开发URL
  prod_path = NULL,                        -- 生产路径为空
  status = 'active'
)
```

### 生产环境注册 (`registerApp`)

**重要架构补充**: Rust 后端同时提供 HTTP Server 作为静态文件服务器

**特点**:
- 子应用打包文件部署到 Rust HTTP Server 的静态文件目录
- 主应用通过 HTTP Server 加载子应用静态资源
- 注册信息包含 `prod_path` 字段（HTTP Server 相对路径）
- 统一的 HTTP 服务架构，开发和生产环境都通过 HTTP 协议

**完整生产环境流程**:
1. 子应用构建打包（如 `npm run build`）
2. 打包文件部署到 Rust HTTP Server 静态文件目录
   ```
   /static/apps/demo/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   └── index-[hash].css
   └── demo/              # 子应用路由前缀目录
   ```
3. 主应用调用 `getAppRegistry().registerApp(config)` 注册到数据库
4. 主应用从数据库读取应用配置，通过 HTTP Server 加载资源
5. 子应用通过 `http://localhost:1421/static/apps/demo/` 提供服务

**数据库存储**:
```sql
INSERT/UPDATE registered_apps (
  id, name, display_name, version, config_json,
  dev_url = NULL,                          -- 开发URL为空
  prod_path = '/static/apps/demo/',        -- HTTP Server相对路径
  status = 'active'
)
```

**资源加载机制**:
```typescript
// 主应用加载生产环境子应用
const prodUrl = `http://localhost:1421${app.prod_path}`;
// 实际访问: http://localhost:1421/static/apps/demo/index.html
```

### 环境检测机制

WonderKits 客户端自动检测运行环境：

- **`http` 模式**: 开发环境，通过 HTTP API 与 Rust Server 通信
- **`tauri-native` 模式**: 生产环境，直接调用 Tauri 原生 API
- **`tauri-proxy` 模式**: 混合模式，通过主应用代理

### 统一 HTTP 服务架构的优势

1. **协议统一**: 开发和生产环境都使用 HTTP 协议
2. **部署简化**: 统一的静态文件服务和 API 服务
3. **开发一致性**: 相同的资源加载机制
4. **扩展性强**: 易于添加 CDN、缓存等优化

## 解决方案架构

### 核心改造点

#### 1. 主应用发现机制改造
**当前**: 文件系统扫描 → **目标**: 数据库查询

**关键文件**:
- `src/core/config/dynamicAppLoader.ts`
- `src/core/service/AppService.ts`
- `src/services/appRegistryApi.ts`

**实施要点**:
```typescript
// 替换静态文件扫描
const appModules = import.meta.glob('../../apps/*/app.config.ts');

// 改为数据库查询
const registeredApps = await AppRegistryApi.getApps({ status: 'active' });
```

#### 2. 动态配置解析和加载
**目标**: 从数据库 `config_json` 字段解析应用配置

**实施细节**:
```typescript
// 动态生成应用配置加载器
async function generateDynamicAppLoader(): Promise<AppConfigLoader> {
  const registeredApps = await AppRegistryApi.getApps({ status: 'active' });
  const configs: AppConfigLoader = {};
  
  for (const app of registeredApps) {
    configs[app.id] = async () => {
      // 解析数据库中的配置
      const config = JSON.parse(app.config_json);
      
      // 根据环境调整配置
      if (app.dev_url) {
        // 开发环境：使用开发URL
        config.wujie.url = app.dev_url;
      } else if (app.prod_path) {
        // 生产环境：构造HTTP Server URL
        const baseUrl = 'http://localhost:1421';
        config.wujie.url = `${baseUrl}${app.prod_path}`;
      }
      
      return config;
    };
  }
  
  return configs;
}
```

#### 3. HTTP Server 静态文件服务集成
**架构要点**: Rust HTTP Server 同时提供 API 和静态文件服务

**目录结构**:
```
HTTP Server (localhost:1421)
├── /api/app-registry/*        # App Registry API
├── /static/apps/demo/         # Demo子应用静态文件
│   ├── index.html
│   ├── assets/
│   └── demo/                  # 路由前缀目录
└── /static/apps/{appId}/      # 其他子应用静态文件
```

**主应用资源加载逻辑**:
```typescript
// 生产环境子应用URL构造
function getSubAppUrl(app: RegisteredApp): string {
  if (app.dev_url) {
    // 开发环境：直接使用开发服务器URL
    return app.dev_url;
  } else if (app.prod_path) {
    // 生产环境：通过HTTP Server加载
    return `http://localhost:1421${app.prod_path}`;
  }
  throw new Error(`应用 ${app.id} 缺少有效的URL配置`);
}
```

#### 4. 子应用主动注册完善
**关键文件**: `demo_plugin/src/app/index.tsx`

**实施要点**:
```typescript
const init = async () => {
  try {
    // 初始化 WonderKits
    await initWonderKits(config);
    
    // 开发环境自动注册
    if (getWonderKitsClient().getMode() === 'http') {
      const result = await getAppRegistry().devRegisterApp(
        demoAppConfig, 
        'http://localhost:3001/demo'
      );
      console.log('开发环境注册成功:', result);
      
      // 通知主应用刷新
      if (window.$wujie?.bus) {
        window.$wujie.bus.$emit('app-registered', {
          appId: 'demo',
          action: result.action
        });
      }
    }
  } catch (error) {
    console.error('初始化或注册失败:', error);
  }
};
```

#### 5. 主子应用通信机制
**双向通信架构**:
- 子应用 → 主应用: 注册成功通知，触发应用列表刷新
- 主应用 → 子应用: 管理指令下发（激活、停用等）

**主应用端实现**:
```typescript
// 监听子应用注册事件
window.$wujie?.bus.$on('app-registered', async (data) => {
  console.log('子应用注册成功:', data);
  
  // 重新从数据库加载应用列表
  await appService.refreshFromDatabase();
  
  // 更新导航和UI
  const { refreshState } = useAppStore.getState();
  refreshState();
});

// AppService 新增方法
class AppService {
  async refreshFromDatabase(): Promise<void> {
    // 清除旧的配置缓存
    clearAppConfigCache();
    
    // 重新加载应用配置
    await this.loadAllApps();
  }
}
```

**子应用端实现**:
```typescript
// 注册成功后通知主应用
const notifyParentApp = (registrationResult: DevRegisterResponse) => {
  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('app-registered', {
      appId: registrationResult.appId,
      action: registrationResult.action,
      timestamp: Date.now(),
      source: 'demo-plugin'
    });
  }
};
```

#### 6. 数据库驱动的应用管理
**核心转变**: 从静态文件驱动转为数据库状态驱动

**实施要点**:
```typescript
// 新的 dynamicAppLoader.ts 实现
export async function getAppConfigLoaders(): Promise<AppConfigLoader> {
  // 完全移除文件系统扫描逻辑
  return await generateDynamicAppLoader();
}

async function generateDynamicAppLoader(): Promise<AppConfigLoader> {
  try {
    const registeredApps = await AppRegistryApi.getApps({ 
      status: 'active' 
    });
    
    const configs: AppConfigLoader = {};
    
    registeredApps.forEach(app => {
      configs[app.id] = () => createAppConfigFromDatabase(app);
    });
    
    return configs;
  } catch (error) {
    console.error('从数据库加载应用配置失败:', error);
    return {}; // 返回空配置，而不是静态配置
  }
}

function createAppConfigFromDatabase(app: RegisteredApp): Promise<AppConfig> {
  return Promise.resolve({
    ...JSON.parse(app.config_json),
    // 运行时动态调整配置
    wujie: {
      ...JSON.parse(app.config_json).wujie,
      url: getSubAppUrl(app)
    }
  });
}
```

## 实施步骤 (分阶段独立实施)

### 🔧 阶段一：主工程改造 (magicteam)

**目标**: 让主应用支持从数据库动态加载应用配置，为子应用动态接入做好基础

#### 1.1 应用发现机制改造
**关键文件**: `src/core/config/dynamicAppLoader.ts`

**改造要点**:
```typescript
// 当前实现：文件系统扫描
const appModules = import.meta.glob('../../apps/*/app.config.ts');

// 目标实现：数据库查询
async function generateDynamicAppLoader(): Promise<AppConfigLoader> {
  const registeredApps = await AppRegistryApi.getApps({ status: 'active' });
  // 从数据库生成配置加载器
}
```

**具体任务**:
- [ ] 完全替换文件系统扫描逻辑
- [ ] 实现数据库配置解析和加载器生成
- [ ] 支持开发/生产环境URL动态构造
- [ ] 添加错误处理和降级机制

#### 1.2 AppService 数据库集成
**关键文件**: `src/core/service/AppService.ts`

**改造要点**:
```typescript
class AppService {
  // 新增：从数据库刷新应用列表
  async refreshFromDatabase(): Promise<void> {
    clearAppConfigCache();
    await this.loadAllApps();
  }
}
```

**具体任务**:
- [ ] 修改 `loadAllApps()` 使用数据库配置
- [ ] 实现 `refreshFromDatabase()` 方法
- [ ] 添加应用状态实时同步机制

#### 1.3 主应用通信监听
**关键文件**: `src/core/stores/appStore.ts`, `src/layout/index.tsx`

**改造要点**:
```typescript
// 监听子应用注册事件
window.$wujie?.bus.$on('app-registered', async (data) => {
  await appService.refreshFromDatabase();
  refreshState();
});
```

**具体任务**:
- [ ] 实现子应用注册事件监听
- [ ] 触发应用列表和导航的自动刷新
- [ ] 添加注册成功/失败的用户提示

#### 1.4 系统类型子应用处理
**重要说明**: 主工程包含系统类型的子应用（如系统设置、登录等），这些应用需要默认自动注册和加载

**关键文件**: `src/core/config/dynamicAppLoader.ts`, `src/apps/system-settings/app.config.ts`, `src/apps/login/app.config.ts`

**改造要点**:
```typescript
async function generateDynamicAppLoader(): Promise<AppConfigLoader> {
  const configs: AppConfigLoader = {};
  
  // 1. 首先加载系统类型的静态配置（保持不变）
  const systemApps = {
    'system-settings': () => import("../../apps/system-settings/app.config").then(m => m.systemSettingsAppConfig),
    'login': () => import("../../apps/login/app.config").then(m => m.loginAppConfig),
    'ykd': () => import("../../apps/ykd/app.config").then(m => m.ykdAppConfig),
    'chatrooms': () => import("../../apps/chatrooms/app.config").then(m => m.chatroomsAppConfig),
  };
  
  // 2. 然后从数据库加载动态注册的应用
  const registeredApps = await AppRegistryApi.getApps({ status: 'active' });
  
  // 3. 合并系统应用和动态应用
  Object.assign(configs, systemApps);
  
  registeredApps.forEach(app => {
    // 避免覆盖系统应用
    if (!configs[app.id]) {
      configs[app.id] = () => createAppConfigFromDatabase(app);
    }
  });
  
  return configs;
}
```

**具体任务**:
- [ ] 识别和保留系统类型子应用的静态配置
- [ ] 实现系统应用和动态应用的合并逻辑
- [ ] 确保系统应用优先级高于动态注册应用
- [ ] 添加应用类型区分和标识

#### 1.5 混合模式架构设计
**目标**: 支持系统应用（静态）+ 动态应用（数据库）的混合架构

**架构设计**:
```
应用加载优先级:
1. 系统类型应用 (静态配置，始终加载)
   ├── system-settings
   ├── login  
   ├── ykd
   └── chatrooms
   
2. 动态注册应用 (数据库配置，按需加载)
   ├── demo (通过devRegisterApp注册)
   ├── other-plugin-1
   └── other-plugin-n
```

**具体任务**:
- [ ] 定义应用类型枚举（system, plugin, extension等）
- [ ] 实现应用优先级和冲突处理机制
- [ ] 为不同类型应用提供不同的管理策略
- [ ] 在应用管理界面区分显示应用类型

#### 1.6 生产环境应用管理功能
**目标**: 为生产环境提供应用包上传、安装和管理功能

**关键文件**: `src/apps/system-settings/components/AppManagement.tsx`

**功能设计**:
```typescript
interface AppPackage {
  file: File;              // 应用包文件 (.zip, .tar.gz)
  manifest?: AppManifest;  // 解析出的应用清单
}

interface AppInstallation {
  packagePath: string;     // 上传后的包路径
  extractPath: string;    // 解压后的目录路径
  config: AppConfig;      // 解析出的应用配置
  status: 'uploading' | 'extracting' | 'installing' | 'completed' | 'failed';
}
```

**具体任务**:
- [ ] 实现应用包上传界面（拖拽上传 + 文件选择）
- [ ] 添加应用包验证（格式、配置文件、完整性检查）
- [ ] 实现自动解压和部署到静态文件目录
- [ ] 解析应用配置并自动注册到数据库
- [ ] 提供安装进度显示和错误处理
- [ ] 支持应用的卸载和更新功能

#### 1.7 Rust 后端应用管理 API
**目标**: 提供应用包处理的后端 API 支持

**新增 API 端点**:
```rust
// 上传应用包
POST /api/app-registry/upload

// 安装上传的应用包  
POST /api/app-registry/install

// 获取安装进度
GET /api/app-registry/install-status/{task_id}

// 卸载应用
DELETE /api/app-registry/apps/{app_id}

// 更新应用
PUT /api/app-registry/apps/{app_id}
```

**具体任务**:
- [ ] 实现应用包上传处理
- [ ] 添加包解压和文件部署逻辑
- [ ] 实现应用配置解析和验证
- [ ] 提供安装进度查询接口
- [ ] 添加应用文件清理功能

#### 1.8 向后兼容和容错处理
**目标**: 确保改造过程中系统稳定运行

**具体任务**:
- [ ] 数据库连接失败时降级到静态配置
- [ ] 动态应用加载失败不影响系统应用
- [ ] 添加详细的错误日志和调试信息
- [ ] 实现应用加载的重试机制

**阶段一验证标准**:
- ✅ 主应用启动正常，无报错
- ✅ 系统类型子应用（system-settings, login, ykd, chatrooms）正常加载
- ✅ 能从数据库加载动态注册的应用列表（即使为空）
- ✅ 系统应用和动态应用在界面上正确区分显示
- ✅ 应用列表可以动态刷新，不影响系统应用
- ✅ 数据库连接异常时，系统应用仍能正常工作
- ✅ 应用管理界面可以正常上传应用包（UI 功能）
- ✅ 后端 API 能够处理应用包上传和安装请求
- ✅ 应用安装进度可以正确显示和查询

---

### 📱 阶段二：子应用改造 (demo_plugin)

**目标**: 让子应用能够自主注册到主应用数据库，实现完全动态接入

#### 2.1 自动注册逻辑实现
**关键文件**: `src/app/index.tsx`

**改造要点**:
```typescript
const init = async () => {
  await initWonderKits(config);
  
  // 开发环境自动注册
  if (getWonderKitsClient().getMode() === 'http') {
    const result = await getAppRegistry().devRegisterApp(
      demoAppConfig,
      'http://localhost:3001/demo'
    );
    
    // 通知主应用
    notifyParentApp(result);
  }
};
```

**具体任务**:
- [ ] 在 WonderKits 初始化后添加注册逻辑
- [ ] 实现环境检测（开发 vs 生产）
- [ ] 添加注册状态监控和错误处理
- [ ] 实现注册重试机制

#### 2.2 注册状态管理页面
**目标**: 创建可视化的注册管理界面

**具体任务**:
- [ ] 创建 `src/pages/Registry/index.tsx` 页面
- [ ] 显示当前应用的注册状态和详细信息
- [ ] 展示主应用注册中心的所有应用列表
- [ ] 提供手动注册/注销功能
- [ ] 显示应用健康状态和统计信息

#### 2.3 状态显示组件增强
**关键文件**: `src/components/StatusIndicator/StatusIndicator.tsx`

**具体任务**:
- [ ] 扩展组件显示注册状态
- [ ] 显示 WonderKits 客户端模式
- [ ] 显示与主应用的连接状态
- [ ] 在首页集成显示注册状态

#### 2.4 子应用通信机制
**目标**: 建立与主应用的双向通信

**改造要点**:
```typescript
// 注册成功通知
const notifyParentApp = (result: DevRegisterResponse) => {
  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('app-registered', {
      appId: result.appId,
      action: result.action,
      timestamp: Date.now()
    });
  }
};
```

**具体任务**:
- [ ] 实现注册成功/失败的主应用通知
- [ ] 监听主应用的管理指令
- [ ] 添加通信状态的可视化反馈

#### 2.5 导航集成
**关键文件**: `src/components/Navigation/Navigation.tsx`

**具体任务**:
- [ ] 添加"注册中心"菜单项
- [ ] 更新路由配置
- [ ] 保持导航样式一致性

**阶段二验证标准**:
- ✅ 子应用启动后自动在主应用中显示
- ✅ 注册状态页面正常工作
- ✅ 主子应用通信正常
- ✅ 状态指示器正确显示注册信息

---

### 🧹 阶段三：静态配置清理 (可选)

**目标**: 移除主应用中的静态配置依赖

**具体任务**:
- [ ] 删除 `magicteam/src/apps/demo/app.config.ts`
- [ ] 清理 `dynamicAppLoader.ts` 中的静态引用
- [ ] 更新相关类型定义
- [ ] 验证完全动态化工作流程

**验证标准**:
- ✅ 主应用不依赖任何静态配置文件
- ✅ 子应用完全通过注册中心接入
- ✅ 开发和生产环境均正常工作

---

### 📚 阶段四：完善开发体验 (增强)

**目标**: 提供完整的开发工具和文档支持

**具体任务**:
- [ ] 实现开发环境热重载支持
- [ ] 添加应用状态实时监控
- [ ] 提供错误诊断和恢复机制
- [ ] 更新开发文档和最佳实践指南

## 分阶段实施的优势

1. **风险控制**: 每个阶段都可以独立测试和验证
2. **并行开发**: 主工程和子应用可以分别开发
3. **渐进式改造**: 不影响现有功能的正常运行
4. **问题隔离**: 便于快速定位和解决问题
5. **灵活部署**: 可以根据需要选择部署时机

## 技术细节

### 数据库架构 (更新)

**registered_apps 表结构**:
```sql
-- registered_apps 表结构 (支持HTTP静态文件服务)
CREATE TABLE registered_apps (
    id TEXT PRIMARY KEY,           -- 应用ID
    name TEXT NOT NULL,            -- 应用名称
    display_name TEXT NOT NULL,    -- 显示名称
    version TEXT NOT NULL,         -- 版本号
    config_json TEXT NOT NULL,     -- 完整应用配置 (JSON)
    dev_url TEXT,                  -- 开发环境URL (如: http://localhost:3001/demo)
    prod_path TEXT,                -- 生产环境HTTP Server路径 (如: /static/apps/demo/)
    app_type TEXT DEFAULT 'wujie', -- 应用类型 (wujie, spa, etc.)
    status TEXT NOT NULL DEFAULT 'inactive', -- 状态 (active, inactive, error)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activated_at TIMESTAMP,   -- 最后激活时间
    last_access_at TIMESTAMP       -- 最后访问时间
);
```

**字段含义说明**:
- `dev_url`: 开发环境完整URL，子应用开发服务器地址
- `prod_path`: 生产环境相对路径，用于构造HTTP Server URL
- `app_type`: 应用类型，区分系统应用和外部插件应用
  - `'system'`: 系统内置应用（如 system-settings, login, ykd, chatrooms）
  - `'plugin'`: 外部插件应用（如 demo，通过注册中心动态接入）
  - `'extension'`: 扩展应用（预留）
- `config_json`: 存储完整的应用配置，包括导航、路由、钩子等信息

**应用类型处理策略**:
- **system类型**: 始终从静态配置文件加载，数据库记录仅用于状态管理
- **plugin类型**: 完全从数据库配置加载，支持动态注册和卸载
- **extension类型**: 预留给未来的应用扩展机制

### Rust HTTP Server 架构

**服务端点设计** (更新版):
```
HTTP Server (localhost:1421)
├── /api/
│   ├── /app-registry/         # App Registry API
│   │   ├── GET /apps          # 获取应用列表
│   │   ├── POST /register     # 注册应用
│   │   ├── POST /dev-register # 开发环境注册
│   │   ├── POST /upload       # 上传应用包 (生产环境)
│   │   ├── POST /install      # 安装应用包
│   │   ├── GET /install-status/{task_id} # 安装进度查询
│   │   ├── PUT /apps/{id}     # 更新应用
│   │   └── DELETE /apps/{id}  # 卸载应用
│   ├── /sql/                  # SQL API
│   ├── /fs/                   # 文件系统API
│   └── /store/                # 键值存储API
│
├── /static/                   # 静态文件服务
│   ├── /apps/                 # 子应用静态文件根目录
│   │   ├── /demo/             # Demo子应用 (开发环境注册)
│   │   │   ├── index.html
│   │   │   ├── assets/
│   │   │   └── demo/          # 应用路由前缀
│   │   ├── /uploaded-app-1/   # 上传安装的应用
│   │   └── /{appId}/          # 其他子应用
│   └── /assets/               # 共享资源
│
└── /uploads/                  # 应用包管理 (新增)
    ├── /packages/             # 上传的应用包存储
    │   ├── demo-v1.0.0.zip
    │   ├── other-app-v2.1.0.tar.gz
    │   └── ...
    ├── /temp/                 # 临时解压目录
    └── /backup/               # 应用备份
```

**静态文件服务特性**:
- **CORS支持**: 允许跨域访问，支持微前端加载
- **缓存策略**: 适当的HTTP缓存头，优化加载性能
- **路由重写**: 支持SPA路由，未匹配路径返回index.html
- **安全控制**: 防止目录遍历，限制访问范围

### 应用包格式规范 (新增)

**标准应用包结构**:
```
demo-app-v1.0.0.zip
├── app.manifest.json      # 应用清单 (必需)
├── dist/                  # 构建产物 (必需)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── demo/              # 路由前缀目录
├── README.md              # 应用说明 (可选)
├── CHANGELOG.md           # 版本日志 (可选)
└── screenshots/           # 应用截图 (可选)
    ├── main.png
    └── features.png
```

**app.manifest.json 格式**:
```json
{
  "manifest": {
    "id": "demo",
    "name": "demo",
    "displayName": "演示应用",
    "version": "1.0.0",
    "description": "这是一个演示应用",
    "author": "MagicTeam",
    "category": "demo",
    "type": "plugin"
  },
  "navigation": {
    "name": "演示应用",
    "href": "/demo",
    "icon": "BeakerIcon",
    "order": 100
  },
  "wujie": {
    "sync": true,
    "alive": true,
    "sandbox": true
  },
  "requirements": {
    "minPlatformVersion": "1.0.0",
    "dependencies": []
  }
}
```

**应用包验证规则**:
- [ ] 包格式：支持 .zip, .tar.gz 格式
- [ ] 必需文件：app.manifest.json, dist/index.html
- [ ] 配置验证：清单格式、字段完整性检查
- [ ] 安全检查：恶意代码扫描、文件路径安全验证
- [ ] 大小限制：单个应用包不超过 100MB

### 配置存储格式 (更新)

**config_json 字段结构**:
```json
{
  "manifest": {
    "id": "demo",
    "name": "demo", 
    "displayName": "Wujie演示应用",
    "version": "1.0.0",
    "description": "演示Wujie微前端架构的功能和集成",
    "author": "MagicTeam",
    "category": "demo",
    "type": "wujie"
  },
  "navigation": {
    "name": "Wujie演示",
    "href": "/demo",
    "matchPath": "/demo",
    "icon": "BeakerIcon",
    "order": 99,
    "visible": true
  },
  "wujie": {
    "url": "http://localhost:3001/demo", // 注意：此字段会在运行时动态调整
    "sync": true,
    "alive": true,
    "sandbox": true,
    "props": {
      "appId": "demo",
      "parentAppName": "magicteam"
    }
  },
  "routes": [
    // 路由配置，如需要
  ],
  "hooks": {
    "onInstall": "async function() { console.log('安装中...'); }",
    "onActivate": "async function() { console.log('激活中...'); }",
    "onDeactivate": "async function() { console.log('停用中...'); }",
    "onUninstall": "async function() { console.log('卸载中...'); }"
  }
}
```

**运行时配置调整**:
```typescript
// 主应用在加载配置时动态调整URL
function adjustConfigForRuntime(app: RegisteredApp): AppConfig {
  const config = JSON.parse(app.config_json);
  
  // 根据环境调整wujie.url
  if (app.dev_url) {
    config.wujie.url = app.dev_url;
  } else if (app.prod_path) {
    config.wujie.url = `http://localhost:1421${app.prod_path}`;
  }
  
  return config;
}
```

### 部署和构建流程

**开发环境**:
1. 子应用运行 `npm run dev` 启动开发服务器
2. 自动调用 `devRegisterApp()` 注册到数据库
3. 主应用从数据库读取并动态加载

**生产环境**:
1. 子应用运行 `npm run build` 构建应用包
2. 通过主应用的应用管理界面上传应用包（.zip 或 .tar.gz）
3. 系统自动解压并部署到 HTTP Server 静态文件目录
4. 系统解析应用配置并调用 `registerApp()` 注册到数据库
5. 主应用通过 HTTP Server 加载静态资源

## 预期效果

### 架构优势
- **完全解耦**: 子应用独立开发和部署
- **动态发现**: 主应用自动发现和加载注册的子应用
- **开发友好**: 支持热重载和实时状态同步
- **扩展性强**: 新增子应用无需修改主应用代码

### 开发流程
1. **开发阶段**: 子应用启动后自动注册到开发环境
2. **测试阶段**: 主应用动态加载和卸载子应用
3. **部署阶段**: 生产环境通过文件系统加载
4. **运维阶段**: 统一的应用状态监控和管理

### 风险控制
- **向后兼容**: 支持混合模式（静态+动态）
- **错误恢复**: 完善的错误处理和重试机制
- **状态一致性**: 主子应用状态实时同步
- **性能优化**: 应用配置缓存和增量更新

## 相关文档

- [APP_REGISTRY_SYSTEM.md](../../magicteam/APP_REGISTRY_SYSTEM.md)
- [MICROAPP_GUIDE.md](../../magicteam/MICROAPP_GUIDE.md)
- [HTTP_API_README.md](../../magicteam/docs/HTTP_API_README.md)
- [Tauri App Registry 开发指南](../../magicteam/src-tauri/src/app_registry/README.md)

---

**更新时间**: 2025-08-23
**版本**: v1.0
**状态**: 计划中