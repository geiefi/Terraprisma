import { Accessor, Signal, createContext, useContext } from 'solid-js';

import { Store } from '../../../../Helpers';
import { FieldInternalValidate } from './setupValidateFunction';
import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FieldProps } from '../FieldProps';

export interface FieldProviderValue<
  ValueType extends FormFieldValue = FormFieldValue
> {
  fieldProps: FieldProps;

  elementId: Accessor<string>;

  errorsT: Store<string[]>;
  valueS: Signal<ValueType | undefined>;
  disabledS: Signal<boolean>;
  focusedS: Signal<boolean>;

  hasContent: Accessor<boolean>;
  hasErrors: Accessor<boolean>;

  validate: FieldInternalValidate;
}

export const FieldContext = createContext<FieldProviderValue>();

export function useField<ValueType extends FormFieldValue = FormFieldValue>() {
  return useContext(FieldContext) as FieldProviderValue<ValueType> | undefined;
}
