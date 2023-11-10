import { defineConfig } from 'rollup';
import styles from 'rollup-plugin-styles';
import withSolid from 'rollup-preset-solid';
import tailwindcss from 'tailwindcss';
// import keysTransformer from 'ts-transformer-keys/transformer';
import autoprefixer from 'autoprefixer';

import tailwindConfig from './tailwind.config.js';

import pkg from './package.json' assert { type: 'json' };

const solidPresetConfig = withSolid({
  input: './src/index.ts',
  targets: ['esm', 'cjs'],
  writePackageJson: true,
  printInstructions: true
});

export default defineConfig({
  ...solidPresetConfig,
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    }),
    ...solidPresetConfig.plugins
  ]
});
