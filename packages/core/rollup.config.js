import { defineConfig } from 'rollup';

import { baseConfig } from '../general/rollup.config.js';

export default defineConfig({
  ...baseConfig,
  output: [
    {
      file: './lib/index.jsx',
      format: 'es'
    }
  ]
});
