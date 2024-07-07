import { Accessor, createSignal } from 'solid-js';

export function createValueSignal<T>(
  value?: Accessor<T>
): [get: Accessor<T | undefined>, setter: (newValue: T) => any] {
  const [internalValue, setInternalValue] = createSignal<T>();

  return [
    () => value?.() ?? internalValue(),
    setInternalValue
  ];
}
