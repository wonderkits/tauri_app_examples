import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createWujieApp } from "@wonderkits/client";
import { initWonderKits } from "@wonderkits/client/react";
import "./styles/index.css";

// 子应用渲染函数
function renderApp() {
  const container = document.getElementById("root");
  if (!container) {
    console.error("未找到根容器元素");
    return;
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );

  // WonderKits 初始化现在在组件中进行

  return root;
}

// 子应用卸载函数
function destroyApp(root?: any) {
  if (root) {
    root.unmount();
  }
}

const init = async () => {
  try {
    await initWonderKits({
      enableFs: true,
      enableStore: true,
      enableSql: true,
      storeFilename: "demo-settings.json",
      sqlConnectionString: "sqlite:test.db",
      httpPort: 1421,
      httpHost: "localhost",  
      verbose: true,
    });
  } catch (error) {
    console.error("WonderKits 初始化失败:", error);
  }
};

init();

createWujieApp(renderApp, destroyApp).init();
