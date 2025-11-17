import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
  },
  server: {
    port: 8000,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
