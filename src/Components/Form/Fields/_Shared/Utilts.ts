import { Accessor, createEffect, createMemo, createSignal, onCleanup, onMount, Setter, Signal } from "solid-js";

import { useForm } from "../../Form";
import { FieldValidator, FieldValue, FormProviderValue, FormValue } from "../../FormContext";

/**
  * The field props that are required for all of the fields used in conjunction with the `<Form />`
  * component
  */
export interface FieldProps {
  name: string;
  validators?: FieldValidator[];

  /**
   * Defines a value that will override the current value of the state of the Field.
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

      form.init(props.name, props.validators || [], '' as K[keyof K]);
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
