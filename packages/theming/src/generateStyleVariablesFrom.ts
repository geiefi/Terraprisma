import { Accent, Color } from './Theme';

function toKebabCase(text: string) {
  return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function generateStyleVariablesFrom(
  obj: Record<string, Color | Record<string, Color | Record<string, Color>>>,
  prefix?: string
) {
  return Object.keys(obj)
    .map((property) => {
      const value = obj[property];
      const kebabCaseProperty = toKebabCase(property);

      const stylesForValue: Record<string, string> = {};
      if (Array.isArray(value)) {
        value
          .filter((l) => l instanceof Color)
          .forEach((v: Color, i) => {
            stylesForValue[
              `--${[prefix, kebabCaseProperty].filter(Boolean).join('-')}-${i}`
            ] = v.toRGBA();
          });
      } else if (typeof value === 'object' && !(value instanceof Color)) {
        const valueStyles = generateStyleVariablesFrom(
          value,
          kebabCaseProperty
        );
        Object.keys(valueStyles).forEach(
          (innerKey) => (stylesForValue[innerKey] = valueStyles[innerKey])
        );
      } else if (value instanceof Color) {
        stylesForValue[
          `--${[prefix, kebabCaseProperty].filter(Boolean).join('-')}`
        ] = value.toRGBA();
      }
      return stylesForValue;
    })
    .reduce((p, styles) => ({ ...p, ...styles }), {});
}
