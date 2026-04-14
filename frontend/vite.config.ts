import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8181, // 确保前端运行在 8181 端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 转发到后端 Spring Boot 端口
        changeOrigin: true,
        // 将请求路径中的 /api 替换为空字符串
        // 例如：/api/user/login -> /user/login
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})