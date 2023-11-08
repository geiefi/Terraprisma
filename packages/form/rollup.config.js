import { defineConfig } from 'rollup';

import { baseConfig } from '../general/rollup.config.js';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  ...baseConfig,
  external: Object.keys(pkg.dependencies)
});
