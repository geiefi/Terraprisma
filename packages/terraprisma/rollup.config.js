import styles from 'rollup-plugin-styles';
import withSolid from 'rollup-preset-solid';
import tailwindcss from 'tailwindcss';
// import keysTransformer from 'ts-transformer-keys/transformer';
import autoprefixer from 'autoprefixer';

import tailwindConfig from './tailwind.config.js';

/** @type {import('rollup').RollupOptions} */
const rollupOptions = {
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    })
  ]
};

export default withSolid({
  input: './src/index.tsx',
  targets: ['esm', 'cjs'],
  printInstructions: true,
  ...rollupOptions
});
