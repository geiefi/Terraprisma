type AllowedValue =
  | string
  | false
  | null
  | undefined
  | AllowedValue[]
  | { [key: string]: boolean | null | undefined };

/**
 * @description Filters for truthy classes and then joins them with a space in between.
 *
 * @returns A class string.
 *
 * @example
 * ```typescript
 * mergeClass('icon rounded', 'button amazing incredible') // 'icon rounded button amazing incredible'
 * ```
 */
export function mergeClass(...classes: AllowedValue[]) {
  return classes
    .flat()
    .filter(Boolean)
    .map((c) => {
      if (typeof c === 'object' && c !== null && !Array.isArray(c)) {
        const resultingClass = [];
        for (const [classes, shouldShow] of Object.entries(c)) {
          if (!!shouldShow) {
            resultingClass.push(classes);
          }
        }
        return resultingClass.join(' ');
      }

      return c;
    })
    .join(' ');
}
