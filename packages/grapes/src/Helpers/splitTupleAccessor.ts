import { Accessor } from "solid-js";

type ApparentTuple<T, Size extends number> = [T, ...T[]] & { length: Size }

/**
  * @description Splits a accessor that returns a tuple into reactive parts that can be
  * destructured.
  *
  * @example 
  * ```ts
  * const [counterIndex, setCounterIndex] = createSignal<0 | 1>(0);
  *
  * const [count, setCount] = createSignal(0);
  * const [secondCount, setSecondCount] = createSignal(0);
  *
  * const [currentCount, setCurrentCount] = splitTupleAccessor(createMemo(() => {
  *   switch (counterIndex) {
  *     case 0:
  *       return [count, setCount];
  *     case 1:
  *       return [secondCount, setSecondCount];
  *     default:
  *       return [undefined, undefined] as [undefined, undefined]; // make sure the return type is a tuple
  *   }
  * })) as [Accessor<number> | undefined, Setter<number> | undefined];
  * ```
  */
export function splitTupleAccessor<
  AccessorValue extends ApparentTuple<any, Size>,
  Size extends number
>(
  accessor: Accessor<AccessorValue>,
  partsToSplitInto: Size
): ApparentTuple<Accessor<any | undefined>, Size> {
  const arr: Accessor<any>[] = [];
  for (let partIndex = 0; partIndex < partsToSplitInto; partIndex++) {
    arr.push(() => {
      const currentValue = accessor();

      if (Array.isArray(currentValue)) {
        return accessor()[partIndex];
      } else {
        return undefined;
      }
    });
  }
  return arr as unknown as ApparentTuple<Accessor<any | undefined>, Size>;
}
