/// <reference types="vitest" />
import solid from 'vite-plugin-solid';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '~': path.resolve(process.cwd(), './src')
    }
  },
  test: {
    globals: true,
    testTransformMode: { web: ['/.[jt]sx?$/'] }
  }
});
