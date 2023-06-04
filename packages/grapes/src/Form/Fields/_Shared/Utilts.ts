import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount, Setter, Signal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { useForm } from "../../Form";
import { FieldValidator, FieldValue, FormProviderValue, FormValue, Store } from "../../FormContext";

export const FieldPropKeys: (keyof FieldProps)[] = [
  'name',
  'manuallyControlled',
  'value',
  'validators',
  'disabled',
  'errorsStore'
];

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
    * @description Defines weather or not the state of the field is communicated across to the nearest `<Form>` or be manually controlled.
    *
    * This is useful when you need to manually controll a field even though it is inside a `<Form>`.
    *
    * This prop makes no difference when there is no `<Form>` above the field.
    *
    * @default false
    */
  manuallyControlled?: boolean;

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
>(props: T, initialValue: FieldValue = ''): FormProviderValue<K> | undefined {
  let form: FormProviderValue<K> | undefined = useForm<K>();
  if (props.manuallyControlled) {
    form = undefined;
  }

  if (form) {
    onMount(() => {
      if (typeof form!.valueFor(props.name) !== 'undefined') {
        form!.store[1](produce(form => {
          form.errors[props.name as keyof K] = [];
        }));
      }

      form!.init(
        props.name,
        props.validators || [],
        (form!.valueFor(props.name) || initialValue) as K[keyof K]
      );
    });

    onCleanup(() => {
      form!.cleanUp(props.name);
    });

    return form;
  } else {
    return undefined;
  }
}

export function setupFieldsValueSignal<
  T extends FieldProps,
  K extends FormValue = FormValue,
  ValueType extends FieldValue = FieldValue
>(props: T, form: FormProviderValue<K> | undefined): Signal<ValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<ValueType | undefined> = createMemo<ValueType>(
      () => form.valueFor(props.name) || '' as any
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

export type FieldInternalValidate = (value: FieldValue) => string[] | undefined;

export function setupValidateFunction<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, setErrors: Setter<string[]>, form: FormProviderValue<K> | undefined): FieldInternalValidate {
  if (typeof form !== 'undefined') {
    createEffect(() => {
      setErrors(form.getErrors(props.name) || []);
    });
  }

  return (value: FieldValue) => {
    if (typeof form !== 'undefined') {
      form.validate(props.name);

      const newErrors = form.getErrors(props.name)

      return newErrors;
    } else if (typeof props.validators !== 'undefined') {
      const newErrors = props.validators
        // we assert it to be truthy here since we filter(Boolean) after
        .map(validator => validator(value)!)
        .filter(Boolean)
        .flat();

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
    // eslint-disable-next-line solid/reactivity
    signal = createSignal<boolean>(false);
  }

  const [disabled, setDisabled] = signal;

  createEffect(on(() => props.disabled, () => {
    setDisabled(props.disabled || false);
  }));

  return [disabled, setDisabled];
}

export interface FieldSetupResult<
  K extends FormValue = FormValue,
  ValueType extends FieldValue = FieldValue
> {
  elementId: Accessor<string>,

  form: FormProviderValue<K> | undefined,
  errorsStore: Store<string[]>,

  valueSignal: Signal<ValueType | undefined>,
  disabledSignal: Signal<boolean>,
  focusedSignal: Signal<boolean>,

  hasContent: Accessor<boolean>,
  hasErrors: Accessor<boolean>,

  validate: FieldInternalValidate,
}

export function setupField<
  T extends FieldProps,
  K extends FormValue = FormValue,
  ValueType extends FieldValue = FieldValue
>(props: T, initialValue: FieldValue = ''): FieldSetupResult<K, ValueType> {
  // eslint-disable-next-line solid/reactivity
  const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

  const form = setupCommunicationWithFormContext<T, K>(props, initialValue);
  const [value, setValue] = setupFieldsValueSignal<T, K, ValueType>(props, form);
  const disabledSignal = setupFieldsDisabledSignal(props, form);
  const validate = setupValidateFunction(props, setErrors, form);

  const id = createMemo(() =>
    form
      ? `field-${form.identification()}-${props.name}`
      : `field-${props.name}`
  );

  const hasContent = createMemo(() => (value() || '').toString().length > 0);
  const hasErrors = createMemo(() => errors && Array.isArray(errors) && typeof errors[0] !== 'undefined');

  return {
    elementId: id,

    form,
    errorsStore: [errors, setErrors],

    valueSignal: [value, setValue],
    disabledSignal,
    // eslint-disable-next-line solid/reactivity
    focusedSignal: createSignal<boolean>(false),

    hasContent,
    hasErrors,

    validate,
  };
}

