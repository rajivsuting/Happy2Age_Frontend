import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  optimizeDeps: {
    include: ['redux-thunk'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    }
  }
})
