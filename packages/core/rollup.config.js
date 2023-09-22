import { defineConfig } from 'rollup';

import MagicString from 'magic-string';
import { walk } from 'estree-walker';
import jsx from 'acorn-jsx';

let nextId = 0;

function getJsxName(node) {
  if (node.type === 'JSXMemberExpression') {
    return `${getJsxName(node.object)}.${getJsxName(node.property)}`;
  }
  return node.name;
}

/** @type {import('rollup').PluginImpl} */
function jsxPreserve() {
  return {
    name: 'jsxPreserve',

    transform(code, fileId) {
      if (fileId.endsWith('.tsx')) {
        const magicString = new MagicString(code);
        const idsByName = new Map();
        const tree = this.parse(code);
        walk(tree, {
          enter(node) {
            if (
              node.type === 'JSXOpeningElement' ||
              node.type === 'JSXClosingElement'
            ) {
              const name = getJsxName(node.name);
              const tagId = idsByName.get(name) || `JSX_ID_${(nextId += 1)}`;

              // overwrite all JSX tags with artificial tag ids so that we can find them again later
              magicString.overwrite(node.name.start, node.name.end, tagId);
              idsByName.set(name, tagId);
            }
            // do not treat the children as separate identifiers
            else if (node.type === 'JSXMemberExpression') {
              this.skip();
            }
          }
        });

        if (idsByName.size > 0) {
          const usedNamesAndIds = [...idsByName].map(
            ([name, tagId]) => `/*${tagId}*/${name}`
          );
          magicString.append(
            `\n__FAKE_FUNC_USED_JSX_NAMES__(${usedNamesAndIds.join(',')});`
          );
          return {
            code: magicString.toString(),
            map: magicString.generateMap()
          };
        }

        return null;
      } else {
        return code;
      }
    },

    renderChunk(code) {
      const replacements = new Map();
      let codeWithRemovedFakeFunction = code

        // this finds all injected artificial usages from the transform hook, removes them
        // and collects the new variable names as a side-effect
        .replace(/__FAKE_FUNC_USED_JSX_NAMES__\(([^)]*)\);/g, (_, usedList) => {
          usedList
            .split(',')
            .map((replacementAndVariable) =>
              replacementAndVariable.match(/^\s*?\/\*([^*]*)\*\/\s*?(\S*)$/)
            )
            .filter(Boolean)
            .forEach(([usedEntry, tagId, updatedName]) =>
              replacements.set(tagId, updatedName)
            );

          // clearing out the actual values
          return '';
        });
      return {
        code: codeWithRemovedFakeFunction.replace(/JSX_ID_\d+/g, (tagId) =>
          replacements.get(tagId)
        ),
        map: null
      };
    }
  };
}

import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import tailwindConfig from './tailwind.config.js';

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
