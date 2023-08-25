import { FormFieldValue } from './FormFieldValue';

/**
 * @description A type function that can be used to get all of the extremity paths
 * into an object `A`.
 *
 * This type helper may also receive a second type parameter called `TypeOfValueAtLeaf`.
 * This parameter can be used to filter only the
 * leafs for which the value *extends* `TypeOfValueAtLeaf`.
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
 * type Test = LeavesOfObject<MyObj>;
 * // type Test = "number" | "strider" | "super" | "role" | "foo.bar"
 *
 * type TestFiltered = LeavesOfObject<MyObj, string>;
 * // type TestFiltered = "strider" | "role" | "foo.bar"
 * ```
 */
export type LeavesOfObject<TValue, OnlyOfType = any> = {
  [TKey in keyof TValue]-?: RestOfLeaves<
    TKey & string,
    TValue[TKey],
    OnlyOfType
  >;
}[keyof TValue];

export type RestOfLeaves<
  TKey extends string,
  TValue,
  OnlyOfType = any
> = TValue extends FormFieldValue | Blob
  ? TValue extends OnlyOfType
    ? `${TKey}`
    : never
  : `${TKey}.${LeavesOfObject<TValue, OnlyOfType>}`;
