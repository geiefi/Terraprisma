import { FieldValidator, FieldValue } from "./FormContext";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// : Record<any, FieldValidator | ((...args: any[]) => FieldValidator)>
const Validators = {
  /**
    * Validates weather or not the field is undefined, null, empty when trimmed 
    * or if being an array is also empty.
    */
  required: (value: FieldValue) => (typeof value === 'undefined')
    || (value === null)
    || (typeof value === 'string' && value.trim().length === 0)
    || (Array.isArray(value) && value.length === 0)
    ? 'This is a required field!'
    : undefined,

  /**
    * Validates weather or not the field matches a Regex email.
    * 
    * Regex: `/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g`
    */
  email: (value: FieldValue) => (typeof value === 'undefined')
    || (value === null)
    || emailRegex.test(value.toString().trim())
    ? 'This is not a valid email!'
    : undefined,

  isEqual: (expectedValue: FieldValue) => (
    (value: FieldValue) => value !== expectedValue
      ? `This is expected to be ${expectedValue}!`
      : undefined
  )
}

export default Validators;

