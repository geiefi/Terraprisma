/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTransformMode: { web: ['/.[jt]sx?$/'] }
  }
});
