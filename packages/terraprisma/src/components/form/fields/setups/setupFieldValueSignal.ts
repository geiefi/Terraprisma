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
import { FieldName, FieldProps, FormFieldValue, FormValue } from '../../types';

export function setupFieldsValueSignal<
  Name extends FieldName<OwnerFormValue, BaseValueType>,
  Props extends FieldProps<OwnerFormValue, BaseValueType, Name>,
  BaseValueType extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue
>(
  props: Props,
  form: FormProviderValue<OwnerFormValue> | undefined,
  initialValue: Props['value'] = '' as any
): Signal<Props['value'] | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<Props['value'] | undefined> = createMemo<
      Props['value']
    >(() =>
      typeof form.valueFor(props.name) !== 'undefined'
        ? (form.valueFor(props.name) as Props['value'])
        : initialValue
    );
    const setValue: Setter<Props['value'] | undefined> = ((v: any) =>
      form.update(props.name, v)) as any;

    return [value, setValue];
  } else {
    const [get, set] = createSignal<Props['value']>();

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
