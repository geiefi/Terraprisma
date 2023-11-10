import path from 'path';
import { fileURLToPath } from 'url';

import withSolid from 'rollup-preset-solid';

// import keysTransformer from 'ts-transformer-keys/transformer';

import styles from 'rollup-plugin-styles';
import alias from '@rollup/plugin-alias';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('rollup').RollupOptions} */
const rollupOptions = {
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    }),
    alias({
      entries: {
        '~': path.join(dirname, 'src'),
        '@terraprisma': path.join(dirname, 'src/components')
      }
    })
  ]
};

export default withSolid({
  input: './src/index.tsx',
  targets: ['esm', 'cjs'],
  printInstructions: true,
  ...rollupOptions
});
