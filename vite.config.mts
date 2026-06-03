import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    Vue(),
    dts({
      outDir: 'types',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs', 'umd'],
      name: 'VHighlight',
      fileName: (format: string) => ({
        es: 'index.mjs',
        cjs: 'index.js',
        umd: 'index.umd.js',
      }[format]),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['clover'],
    },
  },
})