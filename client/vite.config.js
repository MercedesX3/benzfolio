import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'remove-use-client',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('@vercel/analytics') && code.includes('use client')) {
          return {
            code: code.replace(/['"]use client['"];?\s*/g, ''),
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@vercel/analytics/react']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
