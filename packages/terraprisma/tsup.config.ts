import { Options, defineConfig } from 'tsup';

import postcss from 'esbuild-postcss';
import { solidPlugin } from 'esbuild-plugin-solid';

let watching = false;

function generateConfig({ ssr, jsx }: { ssr: boolean; jsx: boolean }): Options {
  const plugins = [postcss()];

  if (!jsx) {
    plugins.push(solidPlugin({ solid: { generate: ssr ? 'ssr' : 'dom' } }));
  }

  const format = 'esm';

  return {
    target: ssr ? 'node18' : 'esnext',
    platform: ssr ? 'node' : 'browser',
    clean: !watching,
    dts: format === 'esm' && !jsx,
    format: ['esm', 'cjs'],
    entry: ssr
      ? {
          server: 'src/index.tsx'
        }
      : {
          browser: 'src/index.tsx'
        },
    esbuildOptions(options) {
      if (jsx) {
        options.jsx = 'preserve';
      }
    },
    outExtension: (context) => {
      const result: ReturnType<Exclude<Options['outExtension'], undefined>> =
        {};
      if (jsx) {
        result['js'] = '.jsx';
      } else if (context.format === 'cjs') {
        result['js'] = '.cjs';
      }

      return result;
    },
    external: [/solid-js(\/.*)?/],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    esbuildPlugins: plugins
  };
}

export default defineConfig((opts) => {
  watching = typeof opts.watch !== 'undefined';
  return [
    generateConfig({ ssr: false, jsx: false }),
    generateConfig({ ssr: false, jsx: true }),
    generateConfig({ ssr: true, jsx: false }),
    generateConfig({ ssr: true, jsx: true })
  ];
});
