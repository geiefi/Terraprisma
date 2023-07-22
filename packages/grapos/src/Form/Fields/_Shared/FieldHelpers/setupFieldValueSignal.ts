import { Accessor, createEffect, createMemo, createSignal, on, Setter, Signal } from 'solid-js';

import { FormProviderValue } from '../../../FormContext';
import { FormValue } from '../../../Types/FormValue';

import { FieldProps } from '../Types/FieldProps';
import { FormFieldValue } from '../../../Types/FormFieldValue';

export function setupFieldsValueSignal<
  Props extends FieldProps<OwnerFormValue>,
  ValueType extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue,
>(
  props: Props, 
  form: FormProviderValue<OwnerFormValue> | undefined, 
  initialValue: ValueType = '' as any
): Signal<ValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<ValueType | undefined> = createMemo<ValueType>(
      () => typeof form.valueFor(props.name) !== 'undefined'
        ? form.valueFor(props.name) as ValueType
        : initialValue
    );
    const setValue: Setter<ValueType | undefined> = (
      (v: any) => form.update(props.name, v)
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