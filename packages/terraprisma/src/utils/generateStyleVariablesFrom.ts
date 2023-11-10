import { Color } from '../Theme';

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
      const varName = `${[prefix, kebabCaseProperty]
        .filter(Boolean)
        .join('-')}`;
      if (Array.isArray(value)) {
        value
          .filter((l) => l instanceof Color)
          .forEach((v: Color, i) => {
            stylesForValue[`--${varName}-${i}`] = v.toRGBA();
            stylesForValue[`--${varName}-${i}-10`] = v.withAlpha(0.1).toRGBA();
            stylesForValue[`--${varName}-${i}-20`] = v.withAlpha(0.2).toRGBA();
            stylesForValue[`--${varName}-${i}-30`] = v.withAlpha(0.3).toRGBA();
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
        stylesForValue[`--${varName}`] = value.toRGBA();
        stylesForValue[`--${varName}-10`] = value.withAlpha(0.1).toRGBA();
        stylesForValue[`--${varName}-20`] = value.withAlpha(0.2).toRGBA();
        stylesForValue[`--${varName}-30`] = value.withAlpha(0.3).toRGBA();
      }
      return stylesForValue;
    })
    .reduce((p, styles) => ({ ...p, ...styles }), {});
}
