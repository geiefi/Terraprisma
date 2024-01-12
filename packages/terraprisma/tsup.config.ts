import { defineConfig } from 'tsup';
import path from 'path';
import stylePlugin from 'esbuild-style-plugin';
import tailwindcss from 'tailwindcss';
import postcss from 'esbuild-postcss';
import scss from 'postcss-scss';
import autoprefixer from 'autoprefixer';
import * as preset from 'tsup-preset-solid'; // 'tsup-preset-solid'

const preset_options: preset.PresetOptions = {
  // array or single object
  entries: [
    // default entry (index)
    {
      // entries with '.tsx' extension will have `solid` export condition generated
      entry: 'src/index.tsx',
      // set `true` or pass a specific path to generate a development-only entry
      dev_entry: true,
      // set `true` or pass a specific path to generate a server-only entry
      server_entry: true
    }
  ],
  esbuild_plugins: [
    postcss()
  ],
  // Setting `true` will remove all `console.*` calls and `debugger` statements
  drop_console: true,
  // Setting `true` will generate a CommonJS build alongside ESM (default: `false`)
  cjs: true
};

export default defineConfig((config) => {
  const watching = !!config.watch;

  const parsed_data = preset.parsePresetOptions(preset_options, watching);

  if (!watching) {
    const package_fields = preset.generatePackageExports(parsed_data);

    package_fields.exports['.'] = { ...package_fields.exports };
    // add the export for styles
    package_fields.exports['./styles.css'] = {
      "import": "./dist/index.css",
      "require": "./dist/index.css",
      "default": "./dist/index.css"
    };

    console.log(
      `package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`
    );

    /*
            will update ./package.json with the correct export fields
        */
    preset.writePackageJson(package_fields);
  }

  return preset.generateTsupOptions(parsed_data);
});
