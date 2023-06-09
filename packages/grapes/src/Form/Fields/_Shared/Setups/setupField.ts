import { Accessor, createMemo, createSignal, Signal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Store } from '../../../../Helpers/Types/Store';

import { FormProviderValue } from '../../../FormContext';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';

import { FieldProps } from '../FieldProps';

import { FieldInternalValidate, setupValidateFunction } from './setupValidateFunction';
import { setupCommunicationWithFormContext } from './setupCommunicationWithFormContext';
import { setupFieldsValueSignal } from './setupFieldValueSignal';
import { setupFieldsDisabledSignal } from './setupFieldsDisabledSignal';

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

