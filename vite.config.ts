/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ include: ['src'], exclude: ['src/**/*.test.*', 'src/**/*.stories.*'] })],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index', cssFileName: 'styles' },
    rolldownOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
    assetsInlineLimit: 0,
  },
  test: { environment: 'jsdom', globals: true },
});
