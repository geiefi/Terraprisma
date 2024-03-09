export type NonObject =
  | string
  | string[]
  | number
  | boolean
  | Date
  | Blob
  | undefined
  | null;

/**
 * @description A type function that can be used to get all of the paths
 * into an object `A`. If using primitives types (i.e. boolean, string, number, ...)
 * it ends up going down into only the leafs of the object.
 *
 * This type helper may also receive a second type parameter called `OnlyOfType`.
 * This parameter can be used to filter only the
 * paths for which the value *extends* `OnlyOfType`.
 *
 * Heavily inspired by Fabian Hiller's amazing implementation of
 * [Modular Forms](https://github.com/fabian-hiller/modular-forms/blob/main/packages/solid/src/types/path.ts).
 *
 * @example
 * ```ts
 * type MyObj = {
 *   foo: { bar: string };
 *   strider: string;
 *   super: boolean;
 *   role: string;
 *   number: number;
 * }
 *
 * type Test = AllKeysOfObject<MyObj>;
 * // type Test = "number" | "strider" | "super" | "role" | "foo" | "foo.bar"
 *
 * type TestFiltered = LeavesOfObject<MyObj, string>;
 * // type TestFiltered = "strider" | "role" | "foo.bar"
 * ```
 */
export type AllKeysOfObject<TValue, OnlyOfType = any> = {
  [TKey in keyof TValue]-?: RestOfKeys<TKey & string, TValue[TKey], OnlyOfType>;
}[keyof TValue];

export type RestOfKeys<TKey extends string, TValue, OnlyOfType = any> =
  | (TValue extends OnlyOfType ? `${TKey}` : never)
  | (TValue extends NonObject
      ? never
      : `${TKey}.${AllKeysOfObject<TValue, OnlyOfType>}`);

