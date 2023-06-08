import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount, Setter, Signal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { Store } from '../../../Helpers/Types/Store';

import { FormProviderValue } from '../../FormContext';

import { FormFieldValue } from '../../Types/FormFieldValue';
import { FormValue } from '../../Types/FormValue';

import { FieldProps } from './FieldProps';
import { useForm } from '../../Form';

export function setupCommunicationWithFormContext<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, initialValue: FormFieldValue = ''): FormProviderValue<K> | undefined {
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
  ValueType extends FormFieldValue = FormFieldValue
>(props: T, form: FormProviderValue<K> | undefined, initialValue: ValueType = '' as any): Signal<ValueType | undefined> {
  if (typeof form !== 'undefined') {
    const value: Accessor<ValueType | undefined> = createMemo<ValueType>(
      () => typeof form.valueFor(props.name) !== 'undefined' 
        ? form.valueFor(props.name) as ValueType
        : initialValue
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

export type FieldInternalValidate = (value: FormFieldValue) => string[] | undefined;

export function setupValidateFunction<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, setErrors: Setter<string[]>, form: FormProviderValue<K> | undefined): FieldInternalValidate {
  if (typeof form !== 'undefined') {
    createEffect(() => {
      setErrors(form.getErrors(props.name) || []);
    });
  }

  return (value: FormFieldValue) => {
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
  ValueType extends FormFieldValue = FormFieldValue
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
  ValueType extends FormFieldValue = FormFieldValue
>(props: T, initialValue: ValueType = '' as any): FieldSetupResult<K, ValueType> {
  // eslint-disable-next-line solid/reactivity
  const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

  const form = setupCommunicationWithFormContext<T, K>(props, initialValue);
  const [value, setValue] = setupFieldsValueSignal<T, K, ValueType>(props, form, initialValue);
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

