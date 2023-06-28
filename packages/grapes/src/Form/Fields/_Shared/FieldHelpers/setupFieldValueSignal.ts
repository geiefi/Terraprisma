import { Accessor, createEffect, createMemo, createSignal, on, Setter, Signal } from 'solid-js';

import { FormProviderValue } from '../../../FormContext';
import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';

import { FieldProps } from '../Types/FieldProps';

export function setupFieldsValueSignal<
  T extends FieldProps<keyof K>,
  K extends FormValue = FormValue,
  ValueType extends FormFieldValue = FormFieldValue
>(props: T, form: FormProviderValue<K> | undefined, initialValue: ValueType = '' as any): Signal<ValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<ValueType | undefined> = createMemo<ValueType>(
      () => typeof form.valueFor(props.name) !== 'undefined'
        ? form.valueFor(props.name) as ValueType
        : initialValue
    );
    const setValue: Setter<ValueType | undefined> = (
      (v: K[keyof K]) => form.update(props.name, v)
    ) as any;

    return [value, setValue];
  } else {
    const [get, set] = createSignal<ValueType>();

    createEffect(on(() => props.value, () => {
      set(props.value as any);
    }));

    return [get, set];
  }
}
