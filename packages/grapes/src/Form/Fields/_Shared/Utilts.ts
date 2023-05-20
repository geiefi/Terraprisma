import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount, Setter, Signal } from "solid-js";

import { useForm } from "../../Form";
import { FieldValidator, FieldValue, FormProviderValue, FormValue } from "../../FormContext";

/**
  * The field props that are required for all of the fields used in conjunction with the `<Form />`
  * component
  */
export interface FieldProps {
  /**
    * @description This is the identification of the field basically. If it is inside a `<Form>`
    * it is used to identify the field's value, field's errors and field's validators inside of it.
    *
    * Currently it is not used if it is outside a `<Form>` but is still important for errors.
    */
  name: string;

  /**
    * @description Validators of the field.
    *
    * Basically just a function that receives the current value of the field once unfocused,
    * and returns either a **string** of an error message when it is invalid or **undefined**
    * when it is valid.
    *
    * There are some basic validators implemented under the `Validators` const.
    */
  validators?: FieldValidator[];

  /**
    * @description Defines if this field is disabled or not.
    * 
    * This is propagated above inside a Form so it is accessible through the Form's store.
    */
  disabled?: Accessor<boolean> | boolean;

  /**
   * @description Defines a value that will override the current value of the state of the Field.
   * ---
   * Will be ignored when there is a form above the field. This is because its value can 
   * be set in other better ways.
   */
  value?: Accessor<FieldValue> | FieldValue;
}

export function setupCommunicationWithFormContext<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T): FormProviderValue<K> | undefined {
  const form = useForm<K>();

  if (form) {
    onMount(() => {
      if (typeof form.valueFor(props.name) !== 'undefined') {
        form.cleanUp(props.name);
      }

      form.init(props.name, props.validators || [], (form.valueFor(props.name) || '') as K[keyof K]);
    });

    onCleanup(() => {
      form.cleanUp(props.name);
    });

    return form;
  } else {
    return undefined;
  }
}

export function setupFieldsValueSignal<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, form?: FormProviderValue<K>): Signal<K[keyof K] | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<K[keyof K] | undefined> = createMemo(
      () => form.valueFor(props.name) || '' as any
    );
    const setValue: Setter<K[keyof K] | undefined> = (
      (v: K[keyof K]) => form.update(props.name, v)
    ) as any;

    return [value, setValue];
  } else {
    const signal = createSignal<K[keyof K]>();
    const [_value, setValue] = signal;

    createEffect(() => {
      if (typeof props.value === 'function') {
        setValue(props.value() as any);
      } else if (typeof props.value !== 'undefined') {
        setValue(props.value as any);
      }
    });

    return signal;
  }
}

export function setupFieldsDisabledSignal<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, form?: FormProviderValue<K>): Signal<boolean> {
  let signal: Signal<boolean>;

  if (typeof form !== 'undefined') {
    const disabled: Accessor<boolean> = createMemo(
      () => form.isDisabled(props.name)
    );
    const setDisabled: Setter<boolean> = (
      (v: boolean) => form.setDisabled(props.name, v)
    ) as any;

    signal = [disabled, setDisabled];
  } else {
    signal = createSignal<boolean>(false);
  }

  const [_disabled, setDisabled] = signal;

  const propsDisabled = typeof props.disabled === 'function'
    ? props.disabled
    : () => props.disabled;

  createEffect(on(propsDisabled, () => {
    setDisabled(propsDisabled() || false);
  }));

  return signal;
}
