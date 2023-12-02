import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * @description Creates a new plugin for tailwind that adds the utility classes
 * based on the initial variable styles generated by terraprisma. It uses the inital styles
 * because it needs to loop through all the variables to generate the utilities.
 *
 * Even thouugh it uses the initial styles there should be no worry of having some property on
 * a theme and not in another since this is not allowed through the typescript that disallows this.
 * Or shouldn't at the very least.
 */
export default function (initalStyles: Record<`--${string}`, string>) {
  return plugin(({ addUtilities }) => {
    const utilities: CSSRuleObject = {};
    for (const [rawPropertyName, value] of Object.entries(initalStyles)) {
      let utilityNameToAdd = '';

      const isBackgroundColor = /\bbg(\b|$)/g.test(rawPropertyName);
      const isTextColor = /\bfg(\b|$)/g.test(rawPropertyName);
      const isBorderColor = /\bborder(\b|$)/g.test(rawPropertyName);

      if (isBackgroundColor) utilityNameToAdd = 'bg';
      else if (isTextColor) utilityNameToAdd = 'text';
      else if (isBorderColor) utilityNameToAdd = 'border';
      else continue;

      let propertyName = rawPropertyName.match(
        /(?<=--).*(?=-(fg|bg|border)(\b|$))/g
      )?.[0];

      if (typeof propertyName === 'undefined') {
        propertyName = rawPropertyName.match(
          /(?<=(fg|bg|border)(\b|$)-).*/g
        )?.[0];
      }
      if (typeof propertyName === 'undefined') {
        throw new Error(
          `Unable to determine tailwind utility class name for variable ${rawPropertyName}: ${value}`
        );
      }
      utilityNameToAdd += `-${propertyName.replaceAll(/-([0-9]+)(\b|$)/g, '')}`;

      const propertyOpacity = Array.from(
        rawPropertyName.matchAll(/-([0-9]+)(\b|$)/g)
      )[0]?.[1];
      if (typeof propertyOpacity !== 'undefined') {
        utilityNameToAdd += `\\/${propertyOpacity}`;
      }

      if (isBackgroundColor) {
        utilities[`.${utilityNameToAdd}`] = {
          'background-color': `var(${rawPropertyName})`
        };
      } else if (isTextColor) {
        utilities[`.${utilityNameToAdd}`] = {
          color: `var(${rawPropertyName})`
        };
      } else if (isBorderColor) {
        utilities[`.${utilityNameToAdd}`] = {
          'border-color': `var(${rawPropertyName})`
        };
      }
    }

    addUtilities(utilities);
  });
}