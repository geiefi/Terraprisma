// import { defineConfig } from 'rollup';
// import typescript from '@rollup/plugin-typescript';
// // import keysTransformer from 'ts-transformer-keys/transformer';
// import jsx from 'acorn-jsx';
// import jsxPreserve from './rollup/jsx-preserve.js';
//
//
// import pkg from './package.json' assert { type: 'json' };
//
// export default defineConfig({
//   input: './src/index.tsx',
//   output: [
//     {
//       file: './dist/index.jsx',
//       assetFileNames: '[name][extname]',
//       format: 'es'
//     }
//   ],
//   external: [
//     'solid-js',
//     'solid-js/web',
//     'solid-js/store',
//     ...Object.keys(pkg.dependencies),
//     ...Object.keys(pkg.peerDependencies)
//   ],
//   acornInjectPlugins: [jsx()],
//   plugins: [
//     styles({
//       plugins: [tailwindcss(tailwindConfig), autoprefixer()],
//       mode: ['extract', 'styles.css']
//     }),
//     typescript({
//       declaration: true,
//       declarationDir: './dist/'
//       // transformers: [
//       //   (service) => ({
//       //     before: [keysTransformer(service.getProgram())],
//       //     after: {}
//       //   })
//       // ]
//     }),
//     jsxPreserve()
//   ]
// });

import { copyFileSync, exists, existsSync, readdirSync } from 'fs';

import styles from 'rollup-plugin-styles';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
