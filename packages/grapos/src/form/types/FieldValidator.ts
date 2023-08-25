import { FormFieldValue } from './FormFieldValue';

export type FieldValidator<ValueType = FormFieldValue> = <
  T extends ValueType | undefined | null
>(
  value: T
) => string | string[] | undefined;
