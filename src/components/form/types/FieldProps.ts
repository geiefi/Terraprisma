import type { FormValue } from '.';
import { EmptyObj, AllKeysOfObject } from '../../../types';

export const FieldPropKeys = [
  'name',
  'manuallyControlled',
  'value',
  'validators',
  'disabled',
  'focused',
  'validateOnStartup',
  'helperText',
  'errorsStore'
] as const;

export type FieldName<
  OwnerFormValue extends FormValue,
  ValueType = any
> = OwnerFormValue extends EmptyObj
  ? string
  : AllKeysOfObject<OwnerFormValue, ValueType>;

