import { createContext } from "solid-js";
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
  errors: Partial<Record<keyof Values, string[]>>;
  validators: Partial<Record<keyof Values, FieldValidator<FieldValue>[]>>;

  constructor(values: Values) {
    this.values = values;
    this.validators = {};
    this.errors = {};
  }
}

export type Store<T> = [get: T, set: SetStoreFunction<T>];

type FieldChangeListener<T extends FormValue> = (newValue: T[keyof T]) => any;
type FormValueChangeListener<T extends FormValue> = (newValues: T) => any;

/**
  * This is going to be the value that comes from the `useForm()` call to get the data
  * and access to some actions related to the context Form.
  */
export class FormProviderValue<T extends FormValue> {
  private onFieldChangeListeners: Partial<Record<keyof T, FieldChangeListener<T>[]>>;
  private onFormValueChangeListeners: FormValueChangeListener<T>[];

  constructor(
    public store: Store<FormStore<T>>,
    public agnosticValidators: AgnosticValidator[],
    private _identification: string
  ) {
    this.onFieldChangeListeners = {};
    this.onFormValueChangeListeners = [];
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
  init(name: keyof T, validators: FieldValidator[], value: T[keyof T]): void {
    this.store[1](produce(form => {
      form.values[name] = value;
      form.validators[name] = validators;
    }));
  }

  /**
    * @description Removes all of the references inside of the formStore that
    * are associated with the field identified by `name`.
    */
  cleanUp(name: keyof T): void {
    this.store[1](produce(form => {
      // delete form.values[name];
      delete form.errors[name];
      delete form.validators[name];
    }));

    delete this.onFieldChangeListeners[name];
  }

  /**
    * @description Runs over all of the validators of the field with the specified
    * `name` and adds the errors to the field if necessary, thus making it invalid.
    */
  validate(name: keyof T): void {
    const formValueKeys: (keyof T)[] = Object.keys(this.store[0].values);
    if (!formValueKeys.includes(name)) {
      throw new FormError(`Cannot validate the field named ${name.toString()} inside of the form with id` +
        ` ${this.identification()} because it does not exist!`);
    } else {
      this.store[1](produce(form => {
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
    this.store[1](produce(form => {
      const fields: (keyof T)[] = Object.keys(form.validators);
      const allErrors: Partial<Record<keyof T, string[]>> = {};
      fields.forEach(field => {
        const validators = form.validators[field]!;
        const value = form.values[field];
        const errors = validators.map(validator => validator(value)!).filter(Boolean);
        allErrors[field] = errors;
      });
      if (this.agnosticValidators) {
        this.agnosticValidators.forEach(validator => {
          const newErrors: Partial<Record<keyof T, string>> = validator(form.values) as any;
          const newFieldsWithErrors: (keyof T)[] = Object.keys(newErrors);
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

  /**
    * @description Checks weather or not the form is valid.
    */
  isValid(): boolean {
    const fieldsWithErrors: (keyof T)[] = Object.keys(this.store[0].errors);
    return fieldsWithErrors.reduce(
      (accumulator, key) => accumulator + this.store[0].errors[key]!.length,
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
  firstErrorFor(name: string): string | undefined {
    return Object.keys(this.store[0].errors).includes(name)
      ? this.store[0].errors[name]![0]
      : undefined;
  }

  hasErrors(name: string): boolean {
    return typeof this.store[0].errors[name] !== 'undefined'
      ? this.store[0].errors[name]!.length > 0
      : false;
  }

  valueFor(name: keyof T): T[keyof T] | undefined {
    return this.store[0].values[name];
  }

  onChange(effect: FormValueChangeListener<T>): void {
    this.onFormValueChangeListeners.push(effect);
  }

  onFieldChange(name: keyof T, effect: FieldChangeListener<T>): void {
    if (Object.hasOwn(this.onFieldChangeListeners, name)
      && Array.isArray(this.onFieldChangeListeners[name])) {
      this.onFieldChangeListeners[name]!.push(effect);
    } else {
      this.onFieldChangeListeners[name] = [effect];
    }
  }

  update(name: keyof T, newValue: T[keyof T]): void {
    this.store[1](produce(form => {
      form.values[name] = newValue;
    }));

    if (Object.hasOwn(this.onFieldChangeListeners, name)
      && Array.isArray(this.onFieldChangeListeners[name])) {
      this.onFieldChangeListeners[name]!.forEach(listener => listener(newValue));
    }

    this.onFormValueChangeListeners.forEach(listener => listener(this.store[0].values));
  }
};

export const FormContext = createContext<FormProviderValue<FormValue>>();
