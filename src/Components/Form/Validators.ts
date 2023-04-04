import { FieldValidator, FieldValue } from "./FormContext";

const Validators: Record<any, FieldValidator> = {
  required: (value: any) => (typeof value === 'undefined')
    || (value === null)
    || (typeof value === 'string' && value.trim().length === 0)
    || (Array.isArray(value) && value.length === 0)
    ? 'This is a required field!'
    : undefined,
}

export default Validators;

