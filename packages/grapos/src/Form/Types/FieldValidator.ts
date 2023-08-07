import { FormFieldValue } from './FormFieldValue';

export type FieldValidator<ValueType = FormFieldValue> = (value: ValueType | undefined | null) => string | string[] | undefined;