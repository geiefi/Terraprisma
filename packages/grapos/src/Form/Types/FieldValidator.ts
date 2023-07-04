import { FormFieldValue } from './FormFieldValue';

export type FieldValidator<ValueType = FormFieldValue> = (value: ValueType) => string | string[] | undefined;
