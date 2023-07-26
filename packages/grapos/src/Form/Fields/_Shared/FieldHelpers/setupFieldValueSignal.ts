import { Accessor, createEffect, createMemo, createSignal, on, Setter, Signal } from 'solid-js';

import { FormProviderValue } from '../../../FormContext';
import { FormValue } from '../../../Types/FormValue';

import { FieldProps } from '../Types/FieldProps';
import { FormFieldValue } from '../../../Types/FormFieldValue';

export function setupFieldsValueSignal<
  Props extends FieldProps<OwnerFormValue, BaseValueType>,
  BaseValueType extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue,
>(
  props: Props, 
  form: FormProviderValue<OwnerFormValue> | undefined, 
  initialValue: BaseValueType = '' as any
): Signal<BaseValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<BaseValueType | undefined> = createMemo<BaseValueType>(
      () => typeof form.valueFor(props.name) !== 'undefined'
        ? form.valueFor(props.name) as BaseValueType
        : initialValue
    );
    const setValue: Setter<BaseValueType | undefined> = (
      (v: any) => form.update(props.name, v)
    ) as any;

    return [value, setValue];
  } else {
    const [get, set] = createSignal<BaseValueType>();

    createEffect(on(() => props.value, () => {
      set(props.value as any);
    }));

    return [get, set];
  }
}