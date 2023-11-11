import { defineConfig } from 'rollup';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
// import keysTransformer from 'ts-transformer-keys/transformer';
import jsx from 'acorn-jsx';
import jsxPreserve from './rollup/jsx-preserve.js';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  input: './src/index.tsx',
  output: [
    {
      file: './dist/index.jsx',
      assetFileNames: '[name][extname]',
      format: 'es'
    }
  ],
  external: [
    'solid-js',
    'solid-js/web',
    'solid-js/store',
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies)
  ],
  acornInjectPlugins: [jsx()],
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    }),
    typescript({
      declaration: true,
      declarationDir: './dist/'
      // transformers: [
      //   (service) => ({
      //     before: [keysTransformer(service.getProgram())],
      //     after: {}
      //   })
      // ]
    }),
    jsxPreserve()
  ]
});
