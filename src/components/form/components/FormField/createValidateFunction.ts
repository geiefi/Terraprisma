import { createEffect, Setter } from 'solid-js';
import { FormProviderValue } from '../../FormContext';
import { FormFieldValue, FieldProps, FormValue } from '../../types';

export type FieldInternalValidate<
  ValueType extends FormFieldValue = FormFieldValue
> = (value: ValueType | undefined) => string[] | undefined;

export function createValidateFunction<
  BaseValueType extends FormFieldValue
>(
  props: FieldProps<FormValue, BaseValueType>,
  setErrors: Setter<string[]>,
  form: FormProviderValue<FormValue> | undefined
): FieldInternalValidate<BaseValueType> {
  if (typeof form !== 'undefined') {
    createEffect(() => {
      setErrors(form.getErrors(props.name) || []);
    });
  }

  return (value: BaseValueType | undefined) => {
    if (typeof form !== 'undefined') {
      form.validate(props.name);

      const newErrors = form.getErrors(props.name);

      return newErrors;
    } else if (typeof props.validators !== 'undefined') {
      const newErrors = props.validators
        // we assert it to be truthy here since we filter(Boolean) after
        .map((validator) => validator(value)!)
        .filter(Boolean)
        .flat();

      setErrors(newErrors);

      return newErrors;
    }
  };
}
