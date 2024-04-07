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
import { FormFieldValue, FieldProps, FormValue } from '../../types';

export function createFieldsDisabledSignal<
  BaseValueType extends FormFieldValue,
>(
  props: FieldProps<FormValue, BaseValueType>,
  form: FormProviderValue<FormValue> | undefined
): Signal<boolean> {
  let signal: Signal<boolean>;

  if (typeof form !== 'undefined') {
    const disabled: Accessor<boolean> = createMemo(() =>
      form.isDisabled(props.name)
    );
    const setDisabled: Setter<boolean> = ((v: boolean) =>
      form.setDisabled(props.name, v)) as any;

    signal = [disabled, setDisabled];
  } else {
    // eslint-disable-next-line solid/reactivity
    signal = createSignal<boolean>(false);
  }

  const [disabled, setDisabled] = signal;

  createEffect(
    on(
      () => props.disabled,
      () => {
        setDisabled(props.disabled || false);
      }
    )
  );

  return [disabled, setDisabled];
}
