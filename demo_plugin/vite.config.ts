import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

export default defineConfig({
  base: `/${pkg.name}`,
  plugins: [
    react(),
    tailwindcss(),
    Pages({
      dirs: [
        { dir: 'src/pages', baseRoute: pkg.name }
      ],
      extensions: ['tsx'],
      exclude: ['**/components/**/*', '**/hooks/**/*'],
      importMode: 'async'
    })
  ],
  server: {
    port: 3001,
    host: true,
    cors: true,
    // 开启CORS支持Wujie加载
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    // 添加重定向规则，支持 /${pkg.name} 访问
    middlewareMode: false,
    proxy: {}
  },
  build: {
    rollupOptions: {
      // 为Wujie优化构建
      external: [],
      output: {
        // 确保样式和脚本可以被正确加载
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names?.[0]?.split('.') || assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  }
})