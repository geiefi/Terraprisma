import { defineConfig } from 'rollup';

import jsxPreserve from 'jsx-preserve';
import jsx from 'acorn-jsx';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
import tailwindcss from 'tailwindcss';
// import keysTransformer from 'ts-transformer-keys/transformer';
import autoprefixer from 'autoprefixer';

import tailwindConfig from './tailwind.config.js';

import pkg from './package.json' assert { type: 'json' };

/** @type {import('rollup').RollupOptions} */
export const baseConfig = {
  input: './src/index.ts',
  output: [
    {
      file: './lib/index.jsx',
      assetFileNames: '[name][extname]',
      intro: `import './styles.css';`,
      format: 'es'
    }
  ],
  external: Object.keys(pkg.dependencies),
  acornInjectPlugins: [jsx()],
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    }),
    typescript({
      declaration: true,
      declarationDir: './lib/'
      // transformers: [
      //   (service) => ({
      //     before: [keysTransformer(service.getProgram())],
      //     after: {}
      //   })
      // ]
    }),
    jsxPreserve()
  ]
};

export default defineConfig(baseConfig);
