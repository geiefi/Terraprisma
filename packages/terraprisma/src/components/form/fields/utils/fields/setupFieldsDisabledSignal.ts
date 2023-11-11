import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  on,
  Setter,
  Signal
} from 'solid-js';

import { FormProviderValue } from '../../../FormContext';
import { FormValue, FormFieldValue } from '../../../types';

import { FieldName, FieldProps } from 'components/form/types';

export function setupFieldsDisabledSignal<
  Name extends FieldName<OwnerFormValue, BaseValueType>,
  BaseValueType extends FormFieldValue,
  Props extends FieldProps<OwnerFormValue, BaseValueType, Name>,
  OwnerFormValue extends FormValue
>(
  props: Props,
  form: FormProviderValue<OwnerFormValue> | undefined
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
