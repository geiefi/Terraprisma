import { defineConfig } from 'rollup';

import jsxPreserve from 'jsx-preserve';
import jsx from 'acorn-jsx';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import tailwindConfig from './tailwind.config.js';

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
  acornInjectPlugins: [jsx()],
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    }),
    typescript({
      declaration: true,
      declarationDir: './lib/'
    }),
    jsxPreserve()
  ]
};

export default defineConfig(baseConfig);
