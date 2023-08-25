import { Accessor, Signal, createContext, useContext } from 'solid-js';

import { FieldInternalValidate } from './setupValidateFunction';

import type { FormFieldValue, EmptyObj, FormValue } from '../../../types';
import type { Store } from '../../../../utils';
import type { FieldName, FieldProps } from '../types';

export interface FieldProviderValue<
  Value extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue
> {
  fieldProps: FieldProps<OwnerFormValue> & { name: FieldName<OwnerFormValue> };

  elementId: Accessor<string>;

  errorsT: Store<string[]>;
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
  return useContext(FieldContext) as
    | FieldProviderValue<Value, OwnerFormValue>
    | undefined;
}
