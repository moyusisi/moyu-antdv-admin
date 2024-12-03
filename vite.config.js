import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export const r = (...args) => resolve(__dirname, '.', ...args)

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, './')
  const env = loadEnv(mode, process.cwd());
  const alias = {
    '~': `${resolve(__dirname, './')}`,
    '@': `${resolve(__dirname, 'src')}`
  }
  return {
    resolve: {
      alias
    },
    server: {
      port: env.VITE_PORT,
      proxy: {
        '/api': {
          target: env.VITE_API_BASEURL,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue()
    ]
  }
})
