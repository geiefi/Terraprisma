import MagicString from 'magic-string';
import { walk } from 'estree-walker';

let nextId = 0;

function getJsxName(node) {
  if (node.type === 'JSXMemberExpression') {
    return `${getJsxName(node.object)}.${getJsxName(node.property)}`;
  }
  return node.name;
}

/** @type {import('rollup').PluginImpl} */
const jsxPreserve = () => {
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
};

export default jsxPreserve;
