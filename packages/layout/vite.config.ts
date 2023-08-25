import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

import pkg from './package.json';

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.build.json',
    }),
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.cjs',
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
});
