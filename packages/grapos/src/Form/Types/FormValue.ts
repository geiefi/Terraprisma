import { FormFieldValue } from './FormFieldValue';

export type FormValue = Record<string, FormFieldValue | Record<string, any>>;