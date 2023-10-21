import { resolve } from 'path';

import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

function getAliasFor(pkg: string) {
  return resolve(__dirname, `../../packages/${pkg}/src`);
}

export default defineConfig({
  base: './',
  plugins: [solid({ ssr: true })],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),

      '@terraprisma/core': getAliasFor('core'),
      '@terraprisma/data-display': getAliasFor('data-display'),
      '@terraprisma/form': getAliasFor('form'),
      '@terraprisma/general': getAliasFor('general'),
      '@terraprisma/utils': getAliasFor('utils'),
      '@terraprisma/icons': getAliasFor('icons'),
      '@terraprisma/layout': getAliasFor('layout'),
      '@terraprisma/navigation': getAliasFor('navigation'),
      '@terraprisma/transitions': getAliasFor('transitions'),
      '@terraprisma/typography': getAliasFor('typography')
    }
  }
});
