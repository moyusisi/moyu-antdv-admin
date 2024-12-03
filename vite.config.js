import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const pathRoot = resolve(__dirname, "./");
const pathSrc = resolve(__dirname, "src");

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, './')
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      '@': pathSrc,
      '~': pathRoot
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
