import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  on,
  Setter,
  Signal
} from 'solid-js';
import { FormProviderValue } from '../../FormContext';
import { FieldProps, FormFieldValue, FormValue } from '../../types';

export function createFieldsValueSignal<BaseValueType extends FormFieldValue>(
  props: FieldProps<FormValue, BaseValueType>,
  form: FormProviderValue<FormValue> | undefined,
  initialValue: BaseValueType = '' as any
): Signal<BaseValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<BaseValueType | undefined> = () =>
      typeof form.valueFor(props.name) !== 'undefined'
        ? (form.valueFor(props.name) as BaseValueType)
        : initialValue;
    const setValue: Setter<BaseValueType | undefined> = ((v: any) =>
      form.update(props.name, v)) as any;

    return [value, setValue];
  } else {
    const [get, set] = createSignal<BaseValueType>();

    createEffect(
      on(
        () => props.value,
        () => {
          set(props.value as any);
        }
      )
    );

    return [get, set];
  }
}
