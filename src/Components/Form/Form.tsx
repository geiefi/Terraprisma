import { JSX, onMount, useContext } from "solid-js";
import { produce, SetStoreFunction } from "solid-js/store";

import { FieldValidator, FieldValue, FormContext, FormProviderValue, FormStore, FormValue } from "./FormContext";

/**
 * A type of validation that is agnostic with relation to which field it validates, meaning
 * it can validate all of the fields at the same time.
 */
export type AgnosticValidator = (value: FormValue) => Record<string, string[]>;

export class FormError extends Error {}

/**
 * @description A component used for managing the values of the form through the provided Store,
 * validating and managing the errors as necessary
 */
export function Form(props: {
  indentification: string,
  formStore: [get: FormStore<any>, set: SetStoreFunction<FormStore<any>>],
  agnosticValidators?: AgnosticValidator[],
  children: JSX.Element[] | JSX.Element
}): JSX.Element {
  const [form, setForm] = props.formStore;

  onMount(() => {
    setForm(produce(form => {
      form.errors = {};
    }));
  });

  return <FormContext.Provider value={[
    props.formStore,
    {
      identification(): string {
        return props.indentification;
      },
      init(
        name: string,
        validators: FieldValidator<FieldValue>[] = [],
        value?: FieldValue,
      ): void {
        setForm(produce(form => {
          form.values[name] = value;
          form.validators[name] = validators;
        }));
      },
      cleanUp(name: string): void {
        setForm(produce(form => {
          delete form.values[name];
          delete form.errors[name];
          delete form.validators[name];
        }));
      },
      firstErrorFor(name: string): string | undefined {
        return Object.keys(form.errors).includes(name)
          ? form.errors[name]![0]
          : undefined;
      },
      isValid(): boolean {
        const keys = Object.keys(form.errors);
        return keys.reduce((accumulator, key) => accumulator + form.errors[key]!.length, 0) === 0;
      },
      isInvalid(): boolean {
        const keys = Object.keys(form.errors);
        return keys.reduce((accumulator, key) => accumulator + form.errors[key]!.length, 0) > 0;
      },
      hasErrors(name: string): boolean {
        return typeof form.errors[name] !== 'undefined'
          ? form.errors[name]!.length > 0
          : false;
      },
      validateAll(): void {
        setForm(produce(form => {
          const fields = Object.keys(form.validators);
          const allErrors: Record<string, string[]> = {};
          fields.forEach(field => {
            const validators = form.validators[field]!;
            const value = form.values[field];
            const errors = validators.map(validator => validator(value)!).filter(Boolean);
            allErrors[field] = errors;
          });
          if (props.agnosticValidators) {
            props.agnosticValidators.forEach(validator => {
              const newErrors = validator(form.values);
              const newFieldsWithErrors = Object.keys(newErrors);
              newFieldsWithErrors.forEach(field => {
                allErrors[field] = newErrors[field];
              });
            });
          }
          form.errors = allErrors;
        }));
      },
      validate(name: string): void {
        if (!Object.keys(form.values).includes(name)) {
          throw new FormError(`Cannot validate the field named ${name} inside of the form with id` +
          ` ${props.indentification} because it does not exist!`);
        } else {
          setForm(produce(form => {
            const validators = form.validators[name] || [];
            const value = form.values[name];
            const errors = validators.map(validator => validator(value)!).filter(Boolean);
            form.errors[name] = errors;
          }));
        }
      },
      valueFor(name: string): FieldValue | undefined {
        return form.values[name];
      },
      update(name: string, newValue: FieldValue): void {
        setForm(produce(form => {
          form.values[name] = newValue;
        }));
      }
    }
  ]}>
    {props.children}
  </FormContext.Provider>;
}

/**
 * Gets a reference to the context of the parent form, this is mainly going
 * to be used inside of internal FoxPox components.
 */
export function useForm<T extends FormValue>() {
  return useContext<FormProviderValue<FormValue> | undefined>(
    FormContext
  ) as unknown as FormProviderValue<T>;
}
