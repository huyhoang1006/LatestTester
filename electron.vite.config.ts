import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/main'),
        '@function': resolve(__dirname, 'src/main/function'),
        '@ipcmain': resolve(__dirname, 'src/main/ipcmain'),
        '@update': resolve(__dirname, 'src/main/update'),
        '@views': resolve(__dirname, 'src/main/entityDef'),
        '@components': resolve(__dirname, 'src/renderer/src/components'),
        '@utils': resolve(__dirname, 'src/renderer/src/utils'),
        '@config': resolve(__dirname, 'src/renderer/src/config'),
        '@window': resolve(__dirname, 'src/main/window'),
        '@/entityDef': resolve(__dirname, 'src/main/entityDef'),
        '@/renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    build: {
      rollupOptions: {
        external: [
          '@journeyapps/sqlcipher',
          'sqlite3',
          'electron',
          'better-sqlite3'
        ]
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/main')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@': resolve(__dirname, 'src/renderer/src'),
        '@views': resolve(__dirname, 'src/renderer/src/views'),
        '@components': resolve(__dirname, 'src/renderer/src/components'),
        '@utils': resolve(__dirname, 'src/renderer/src/utils'),
        '@config': resolve(__dirname, 'src/renderer/src/config'),
        'vue2-leaflet': resolve(__dirname, 'src/renderer/src/vue2-leaflet-stub.js')
      }
    },
    plugins: [vue()],
    server: {
      host: '127.0.0.1',
      port: 8080,
      strictPort: true,
      hmr: { host: '127.0.0.1', port: 8080 }
    }
  }
})
