import { copyFileSync, readdirSync } from 'fs';

import styles from 'rollup-plugin-styles';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

import path from 'path';

/** @type {import('rollup').RollupOptions} */
const customOptions = {
  plugins: [
    styles({
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      mode: ['extract', 'styles.css']
    })
  ]
};

import withSolid from 'rollup-preset-solid';

const rollupOptions = withSolid([
  {
    mappingName: 'client',
    input: 'src/index.tsx',
    output: [
      {
        file: './dist/index.js',
        format: 'module'
      }
    ],
    solidOptions: {
      hydratable: true
    },
    ...customOptions
  },
  {
    mappingName: 'server',
    input: 'src/index.tsx',
    output: [
      {
        file: './dist/index.cjs',
        format: 'cjs'
      }
    ],
    solidOptions: {
      generate: 'ssr',
      hydratable: true
    },
    targets: ['cjs'],
    ...customOptions
  }
]);

const recursiveReaddir = (dir) => {
  const allFiles = [];
  const filesInDir = readdirSync(dir, {
    withFileTypes: true
  });

  filesInDir.forEach((file) => {
    allFiles.push(file);
    if (file.isDirectory()) {
      allFiles.push(...recursiveReaddir(`${file.path}/${file.name}`));
    }
  });

  return allFiles;
};

const copyCSSToSourcePlugin = (name) => ({
  name: 'copy-css-to-source',
  buildEnd() {
    const allFiles = recursiveReaddir('./src');
    const allCSSFiles = allFiles.filter(
      (file) =>
        file.isFile() &&
        (file.name.endsWith('.css') || file.name.endsWith('.scss'))
    );
    allCSSFiles.forEach((file) => {
      const basePath = path.normalize(file.path);
      copyFileSync(
        path.join(basePath, file.name),
        path.join('./dist', basePath.replace('src', name), file.name)
      );
    });
  }
});

rollupOptions.map((opts) => {
  opts.output = opts.output.map((obj) => ({
    ...obj,
    assetFileNames: '[name][extname]'
  }));
  opts.plugins.push(copyCSSToSourcePlugin);

  return opts;
});

export default rollupOptions;
