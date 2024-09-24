import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/tests/**/*'],
  splitting: true,
  clean: true,
  outDir: 'dist',
  outExtension: () => ({
    js: '.js',
  }),
})
