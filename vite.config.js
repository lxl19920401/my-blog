import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/my-blog/',
  plugins: [
    vue(),
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.endsWith('.md')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          }
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('highlight.js')) return 'vendor-hljs'
          if (id.includes('marked') || id.includes('gray-matter') || id.includes('js-yaml')) return 'vendor-md'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
