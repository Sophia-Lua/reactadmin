import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/dev-api': {
        target: 'https://vue.ruoyi.vip',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, '/prod-api/'),
      },
    },
    allowedHosts: ['.monkeycode-ai.online'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'antd'],
          echarts: ['echarts'],
        },
      },
    },
  },
})
