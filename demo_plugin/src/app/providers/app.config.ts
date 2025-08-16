import { AppConfig } from "@wonderkits/app";
import { BeakerIcon } from "@heroicons/react/24/outline";

export const demoAppConfig: AppConfig = {
  manifest: {
    id: "demo",
    name: "demo",
    displayName: "Wujie演示应用",
    version: "1.0.0",
    description: "演示Wujie微前端架构的功能和集成",
    author: "MagicTeam",
    category: "demo",
    keywords: ["演示", "测试", "Wujie", "微前端"],
    permissions: [
      {
        id: "demo.read",
        name: "读取演示数据",
        description: "访问演示功能数据",
        required: true,
      },
    ],
  },

  navigation: {
    name: "Wujie演示",
    href: "/demo", // 简化路径，去掉index
    matchPath: "/demo",
    icon: BeakerIcon,
    current: false,
    order: 99,
    visible: true,
  },

  // 移除静态路由配置，改为动态路由注册
  routes: [],

  hooks: {
    async onInstall() {
      console.log("Wujie Demo应用正在安装...");
    },

    async onActivate() {
      console.log("Wujie Demo应用正在激活...");
    },

    async onDeactivate() {
      console.log("Wujie Demo应用正在停用...");
    },

    async onUninstall() {
      console.log("Wujie Demo应用正在卸载...");
    },
  },

  // 支持两种模式：auto模式会根据wujie配置自动选择
  mode: "wujie",

  // Wujie微前端配置 - 简化配置，先确保基本加载能工作
  wujie: {
    url: "http://localhost:3001/demo", // 子应用URL
    sync: true, // 先关闭同步模式
    alive: true, // 先关闭保活模式
    sandbox: true, // 先关闭沙箱模式，避免复杂的隔离问题
    props: {
      // 传递给子应用的属性
      appId: "demo",
      parentAppName: "magicteam",
    },
  },
};
