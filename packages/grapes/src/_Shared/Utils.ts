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
export function mergeClass(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
  * @description `Console.log`'s the `el` then returns it
  *
  * This function is inspired in Rust's `dbg!` macro.
  */
export function dbg<T=any>(el: T): T {
  console.log(el);
  return el;
}
