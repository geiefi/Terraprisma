import path from 'path';

import { defineConfig, mergeConfig } from 'vite';

import pkg from './package.json';
import { baseConfig } from '../core/vite.config';

export default defineConfig(
  mergeConfig(
    baseConfig,
    {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
        },
        rollupOptions: {
          external: [
            ...Object.keys(pkg.dependencies),
            "solid-js",
            "solid-js/web",
            "solid-js/store",
          ],
        },
      },
    }
  )
);
