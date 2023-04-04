import { createContext } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export type FieldValue = string | string[] | number | boolean | Date;

export type FormValue = Record<string, FieldValue>;

export type FieldValidator<ValueType = FieldValue> = (value: ValueType) => string | undefined;

/**
  * @example 
  * ```typescript
  * const formStore = createStore<FormStore<MyFormValueType>>(new FormStore({
  *   // all of my default field values
  * }))
  * ```
  */
export class FormStore<Values extends FormValue> {
  values: Values;
  errors: Partial<Record<keyof Values, string[]>>;
  validators: Partial<Record<keyof Values, FieldValidator<FieldValue>[]>>;

  constructor(values: Values) {
    this.values = values;
    this.validators = {};
    this.errors = {};
  }
}

export type FormActions = {
  identification(): string;
  /**
    * @description Initializes the field inside of the formStore 
    * using the `validators` and the initial `value`.
    *
    * @param name The name that the field is going to hold.
    * This is very important and should be uinque because this is going
    * to be used to identify the field and associate it with the proper element.
    *
    * @param validators A array of `validators`.
    * Validators are basically just functions that either return an error message
    * or nothing based on the value of the field. There are some predefined Validators
    * such as `Validators.required`.
    *
    * @param value Just the initial value of the field being initialized.
    */
  init(name: string, validators: FieldValidator[], value: FieldValue): void;
  /**
    * @description Removes all of the references inside of the formStore that
    * are associated with the field identified by `name`.
    */
  cleanUp(name: string): void;
  /**
    * @description Runs over all of the validators of the field with the specified
    * `name` and adds the errors to the field if necessary, thus making it invalid.
    */
  validate(name: string): void;
  /**
    * @description Validates all of the fields and then uses all of the agnostic
    * validators associated with the form.
    */
  validateAll(): void;
  /**
    * @description Checks weather or not the form is valid.
    */
  isValid(): boolean;
  /**
    * @description Checks weather or not the form is invalid.
    */
  isInvalid(): boolean;
  /**
    * @description Gets the first error for the field with the specified
    * `name`.
    */
  firstErrorFor(name: string): string | undefined;
  hasErrors(name: string): boolean;
  valueFor(name: string): FieldValue | undefined;
  update(name: string, newValue: FieldValue): void;
}

/**
  * This is going to be the value that comes from the `useForm()` call to get the data
  * and access to some actions related to the context Form.
  */
export type FormProviderValue<T extends FormValue> = [
  formStore: [get: FormStore<T>, set: SetStoreFunction<FormStore<T>>],
  actions: FormActions,
];

export const FormContext = createContext<FormProviderValue<FormValue>>();
