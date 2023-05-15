import { createContext, Setter } from "solid-js";
import { produce, SetStoreFunction } from "solid-js/store";

export type FieldValue = string | string[] | number | boolean | Date | Record<string, any>;

export type FormValue = Record<string, FieldValue>;

export type FieldValidator<ValueType = FieldValue> = (value: ValueType) => string | undefined;

/**
 * A type of validation that is agnostic with relation to which field it validates, meaning
 * it can validate all of the fields at the same time.
 */
export type AgnosticValidator = (value: FormValue) => Record<string, string[]>;

export class FormError extends Error { }

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
  /**
    * A array of field names that are currently disabled
    */
  disabled: Partial<Record<keyof Values, boolean>>;
  errors: Partial<Record<keyof Values, string[]>>;
  validators: Partial<Record<keyof Values, FieldValidator<FieldValue>[]>>;

  constructor(values: Values) {
    this.values = values;
    this.disabled = {};
    this.validators = {};
    this.errors = {};
  }
}

export type Store<T> = [get: T, set: SetStoreFunction<T>];

type FormValueChangeListener<T extends FormValue> = (newValues: T) => any;

/**
  * This is going to be the value that comes from the `useForm()` call to get the data
  * and access to some actions related to the context Form.
  */
export class FormProviderValue<Values extends FormValue> {
  private onFormValueChangeListeners: FormValueChangeListener<Values>[];

  private form: FormStore<Values>;
  private setForm: Setter<FormStore<Values>>;

  constructor(
    public store: Store<FormStore<Values>>,
    public agnosticValidators: AgnosticValidator[],
    private _identification: string
  ) {
    this.onFormValueChangeListeners = [];

    this.form = store[0];
    this.setForm = store[1];
  }

  identification(): string {
    return this._identification;
  }

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
  init(name: keyof Values, validators: FieldValidator[], value: Values[keyof Values]): void {
    this.setForm(produce(form => {
      form.values[name] = value;
      form.validators[name] = validators;
    }));
  }

  /**
    * @description Removes all of the references inside of the formStore that
    * are associated with the field identified by `name` except for its value.
    */
  cleanUp(name: keyof Values): void {
    this.setForm(produce(form => {
      // delete form.values[name];
      delete form.errors[name];
      delete form.validators[name];
    }));
  }

  /**
    * @description Runs over all of the validators of the field with the specified
    * `name` and adds the errors to the field if necessary, thus making it invalid.
    */
  validate(name: keyof Values): void {
    const formValueKeys: (keyof Values)[] = Object.keys(this.form.values);
    if (!formValueKeys.includes(name)) {
      throw new FormError(`Cannot validate the field named ${name.toString()} inside of the form with id` +
        ` ${this.identification()} because it does not exist!`);
    } else {
      this.setForm(produce(form => {
        const validators = form.validators[name] || [];
        const value = form.values[name];
        const errors = validators.map(validator => validator(value)!).filter(Boolean);
        form.errors[name] = errors;
      }));
    }
  }

  /**
    * @description Validates all of the fields and then uses all of the agnostic
    * validators associated with the form.
    */
  validateAll(): void {
    this.setForm(produce(form => {
      const fields: (keyof Values)[] = Object.keys(form.validators);
      const allErrors: Partial<Record<keyof Values, string[]>> = {};
      fields.forEach(field => {
        const validators = form.validators[field]!;
        const value = form.values[field];
        const errors = validators.map(validator => validator(value)!).filter(Boolean);
        allErrors[field] = errors;
      });
      if (this.agnosticValidators) {
        this.agnosticValidators.forEach(validator => {
          const newErrors: Partial<Record<keyof Values, string>> = validator(form.values) as any;
          const newFieldsWithErrors: (keyof Values)[] = Object.keys(newErrors);
          newFieldsWithErrors.forEach(field => {
            if (typeof allErrors[field] !== 'undefined') {
              allErrors[field]!.push(newErrors[field]!);
            } else {
              allErrors[field] = [newErrors[field]!];
            }
          });
        });
      }
      form.errors = allErrors;
    }));
  }

  isDisabled(name: keyof Values): boolean {
    return this.form.disabled[name] || false;
  }

  setDisabled(name: keyof Values, disabled: boolean): void {
    this.setForm(produce(form => {
      form.disabled[name] = disabled;
      form.errors[name] = [];
    }));
  }

  /**
    * @description Checks weather or not the form is valid.
    */
  isValid(): boolean {
    const fieldsWithErrorObject: (keyof Values)[] = Object.keys(this.form.errors);
    return fieldsWithErrorObject.reduce(
      (accumulator, key) => accumulator + this.form.errors[key]!.length,
      0
    ) === 0;
  }

  /**
    * @description Checks weather or not the form is invalid.
    */
  isInvalid(): boolean {
    return !this.isValid();
  }

  /**
    * @description Gets the first error for the field with the specified
    * `name`.
    */
  firstErrorFor(name: keyof Values): string | undefined {
    return Object.keys(this.form.errors).includes(name.toString())
      ? this.form.errors[name]![0]
      : undefined;
  }

  hasErrors(name: keyof Values): boolean {
    return typeof this.form.errors[name] !== 'undefined'
      ? this.form.errors[name]!.length > 0
      : false;
  }

  valueFor(name: keyof Values): Values[keyof Values] | undefined {
    return this.form.values[name];
  }

  onChange(effect: FormValueChangeListener<Values>): void {
    this.onFormValueChangeListeners.push(effect);
  }

  update(name: keyof Values, newValue: Values[keyof Values]): void {
    this.setForm(produce(form => {
      form.values[name] = newValue;
    }));

    this.onFormValueChangeListeners.forEach(listener => listener(this.form.values));
  }
};

export const FormContext = createContext<FormProviderValue<FormValue>>();
