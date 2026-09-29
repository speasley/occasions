import path from 'path'
import { defineConfig } from 'vite'

// `vite build` emits ESM + CJS for bundlers and Node;
// `vite build --mode iife` emits a standalone file for <script> tags
export default defineConfig(({ mode }) => ({
  build: mode === 'iife'
    ? {
        emptyOutDir: false,
        lib: {
          entry: path.resolve(__dirname, './src/browser.js'),
          name: 'occasions',
          formats: ['iife'],
          fileName: () => 'occasions.iife.js'
        },
        rollupOptions: {
          output: { exports: 'default' }
        }
      }
    : {
        lib: {
          entry: {
            occasions: path.resolve(__dirname, './src/index.js'),
            presets: path.resolve(__dirname, './src/presets.js')
          },
          formats: ['es', 'cjs'],
          fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
          output: { exports: 'named' }
        }
      },
  test: {
    coverage: {
      provider: 'istanbul',
      all: true,
      include: ['src/**'],
      reporter: ['text', 'json', 'html']
    }
  }
}))
