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
export function mergeClass(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
