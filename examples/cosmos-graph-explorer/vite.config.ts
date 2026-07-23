import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  resolve: {
    // Cosmos imports gl-bench by package name. Vite 8's Rolldown resolver
    // otherwise selects its global-script browser build, which has no ESM
    // default export. Point at the package's own declared module build.
    alias: {
      'gl-bench': fileURLToPath(
        new URL(
          './node_modules/gl-bench/dist/gl-bench.module.js',
          import.meta.url,
        ),
      ),
    },
  },
  server: {
    fs: {
      allow: [fileURLToPath(new URL('../..', import.meta.url))],
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
  },
})
