import { createEffect, Setter } from 'solid-js';
import { FormProviderValue } from '../../FormContext';
import { FormFieldValue, FieldName, FieldProps, FormValue } from '../../types';

export type FieldInternalValidate<
  ValueType extends FormFieldValue = FormFieldValue
> = (value: ValueType | undefined) => string[] | undefined;

export function setupValidateFunction<
  Name extends FieldName<OwnerFormValue, BaseValueType>,
  Props extends FieldProps<OwnerFormValue, BaseValueType, Name>,
  BaseValueType extends FormFieldValue,
  OwnerFormValue extends FormValue
>(
  props: Props,
  setErrors: Setter<string[]>,
  form: FormProviderValue<OwnerFormValue> | undefined
): FieldInternalValidate<Props['value']> {
  if (typeof form !== 'undefined') {
    createEffect(() => {
      setErrors(form.getErrors(props.name) || []);
    });
  }

  return (value: Props['value']) => {
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
