import { resolve } from 'path';

import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [solid({ ssr: true })],
  build: {
    target: 'esnext'
  },
  // ssr: {
  //   noExternal: ['grapos']
  // },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  }
});
