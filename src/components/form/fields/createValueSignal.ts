import { Accessor, createSignal } from 'solid-js';
import { FieldRequiredProperties } from '../FormContext';

export function createValueSignal<T>(
  props: FieldRequiredProperties<T>
): [get: Accessor<T | undefined>, setter: (newValue: T) => any] {
  const [internalValue, setInternalValue] = createSignal<T>();

  return [
    () => props.value ?? internalValue(),
    (v) => {
      setInternalValue(v as any);
      props.onInstantChange?.(v);
    }
  ];
}
