
import { Accessor, Signal, createContext, useContext } from 'solid-js';
import { EmptyObj, StoreTuple } from '../../../../types';
import { FormFieldValue, FormValue, FieldProps, FieldName } from '../../types';
import { FieldInternalValidate } from './createValidateFunction';

export interface FieldProviderValue<
  Value extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue
> {
  fieldProps: FieldProps<OwnerFormValue> & { name: FieldName<OwnerFormValue> };

  elementId: Accessor<string>;

  errorsT: StoreTuple<string[]>;
  valueS: Signal<Value | undefined>;
  disabledS: Signal<boolean>;
  focusedS: Signal<boolean>;

  hasContent: Accessor<boolean>;
  hasErrors: Accessor<boolean>;

  validate: FieldInternalValidate<Value | undefined>;
}

export const FieldContext = createContext<FieldProviderValue<any>>();

export function useField<
  Value extends FormFieldValue = FormFieldValue,
  OwnerFormValue extends FormValue = EmptyObj
>() {
  const context = useContext(FieldContext);

  if (typeof context === 'undefined') {
    throw new Error(
      'useField error: This cannot be used outside of a field context, maybe you are using some internal component?'
    );
  }

  return context as unknown as FieldProviderValue<Value, OwnerFormValue>;
}
