import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount, Setter, Signal } from "solid-js";
import { createStore } from "solid-js/store";

import { useForm } from "../../Form";
import { FieldValidator, FieldValue, FormProviderValue, FormValue, Store } from "../../FormContext";

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
    * @description A store containing all of the errors of the field.
    *
    * This store is to be used when manually trying to control a Field
    * without any parent `<Form>`.
    */
  errorsStore?: Store<string[]>;

  /**
    * @description Defines if this field is disabled or not.
    * 
    * This is propagated above inside a Form so it is accessible through the Form's store.
    */
  disabled?: boolean;

  /**
   * @description Defines a value that will override the current value of the state of the Field.
   * ---
   * Will be ignored when there is a form above the field. This is because its value can 
   * be set in other better ways.
   */
  value?: FieldValue;
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
>(props: T, form: FormProviderValue<K> | undefined): Signal<K[keyof K] | undefined> {
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

    createEffect(on(() => props.value, () => {
      setValue(props.value as any);
    }));

    return signal;
  }
}

export type FieldInternalValidate = (value: FieldValue) => string[] | undefined;

export function setupValidateFunction<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, setErrors: Setter<string[]>, form: FormProviderValue<K> | undefined): FieldInternalValidate {
  return (value: FieldValue) => {
    if (typeof form !== 'undefined') {
      form.validate(props.name);

      return form.getErrors(props.name);
    } else if (typeof props.validators !== 'undefined') {
      const newErrors = props.validators
        // we assert it to be truthy here since we filter(Boolean) after
        .map(validator => validator(value)!)
        .filter(Boolean);

      setErrors(newErrors);

      return newErrors;
    }
  }
}

export function setupFieldsDisabledSignal<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, form: FormProviderValue<K> | undefined): Signal<boolean> {
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

  createEffect(on(() => props.disabled, () => {
    setDisabled(props.disabled || false);
  }));

  return signal;
}

export interface FieldSetupResult<K extends FormValue = FormValue> {
  elementId: Accessor<string>,

  form: FormProviderValue<K> | undefined,
  errorsStore: Store<string[]>,

  valueSignal: Signal<K[keyof K] | undefined>,
  disabledSignal: Signal<boolean>,
  focusedSignal: Signal<boolean>,

  hasContent: Accessor<boolean>,

  validate: FieldInternalValidate,
};

export function setupField<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T): FieldSetupResult<K> {
  const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

  const form = setupCommunicationWithFormContext<T, K>(props);
  const [value, setValue] = setupFieldsValueSignal(props, form);
  const disabledSignal = setupFieldsDisabledSignal(props, form);
  const validate = setupValidateFunction(props, setErrors, form);

  const focusedSignal = createSignal<boolean>(false);

  const id = createMemo(() =>
    form
      ? `field-${form.identification()}-${props.name}`
      : `field-${props.name}`
  );

  const hasContent = createMemo(() => (value() || '').toString().length > 0);

  return {
    elementId: id,

    form,
    errorsStore: [errors, setErrors],

    valueSignal: [value, setValue],
    disabledSignal,
    focusedSignal,

    hasContent,

    validate,
  };
}