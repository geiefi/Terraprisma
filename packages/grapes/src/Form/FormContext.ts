import { createContext, Setter } from 'solid-js';
import { produce, SetStoreFunction } from 'solid-js/store';
import { deeplyTrack } from '../Helpers/deeplyTrack';

export type FieldValue = string | string[] | number | boolean | Date | Record<string, any> | undefined;

export type FormValue = Record<string, FieldValue>;

export type FieldValidator<ValueType = FieldValue> = (value: ValueType) => string | string[] | undefined;

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

/**
  * This is going to be the value that comes from the `useForm()` call to get the data
  * and access to some actions related to the context Form.
  */
export class FormProviderValue<Values extends FormValue> {
  private form: FormStore<Values>;
  private setForm: Setter<FormStore<Values>>;

  // this doesn't really need to be reactive
  private __isCleaningUp: boolean;

  constructor(
    public store: Store<FormStore<Values>>,
    public agnosticValidators: AgnosticValidator[],
    private _identification: string
  ) {
    this.form = store[0];
    this.setForm = store[1];

    this.__isCleaningUp = false;
  }

  /**
    * @description Weather or not the form context this belongs to is being cleaned up.
    * 
    * This is used so that the values of the fields are persisted once the Form is being cleaned up
    * but are removed if the Form is not being cleaned up.
    */
  get isCleaningUp() {
    return this.__isCleaningUp;
  }

  set isCleaningUp(cleaningUp: boolean) {
    this.__isCleaningUp = cleaningUp;
  }

  identification(): string {
    return this._identification;
  }

  track(): void {
    deeplyTrack(this, ['onFormValueChangeListeners', 'setForm']);
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
    if (document.querySelectorAll(`#field-${this.identification()}-${name.toString()}`).length > 1) {
      throw new FormError(
        `Error with the field "${name.toString()}" on the <Form> with identification "${this.identification()}": `
        + 'You cannot have multiple fields defined on the same <Form> that have the same name!'
      );
    }
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
    console.log(name);
    this.setForm(produce(form => {
      if (!this.isCleaningUp) {
        delete form.values[name];
      }
      delete form.errors[name];
      delete form.validators[name];
    }));
  }

  /**
    * @description Runs over all of the validators of the field with the specified
    * `name` and adds the errors to the field if necessary, thus making it invalid.
    */
  validate(name: keyof Values): void {
    if (this.isDisabled(name)) return;

    const formValueKeys: (keyof Values)[] = Object.keys(this.form.values);
    if (!formValueKeys.includes(name)) {
      throw new FormError(`Cannot validate the field named ${name.toString()} inside of the form with id` +
        ` ${this.identification()} because it does not exist!`);
    } else {
      this.setForm(produce(form => {
        const validators = form.validators[name] || [];
        const value = form.values[name];
        const errors = validators.map(validator => validator(value)!).flat().filter(Boolean);
        form.errors[name] = errors;
      }));
    }
  }

  /**
    * @description Validates all of the fields and then uses all of the agnostic
    * validators associated with the form.
    */
  validateAll(): boolean {
    this.setForm(produce(form => {
      const fields: (keyof Values)[] = Object.keys(form.validators);
      const errors: Partial<Record<keyof Values, string[]>> = {};

      fields.forEach(field => {
        if (this.isDisabled(field)) return;

        const validators = form.validators[field]!;
        const value = form.values[field];
        const caughtErrors = validators.map(validator => validator(value)!).flat().filter(Boolean);
        errors[field] = caughtErrors;
      });

      if (this.agnosticValidators) {
        this.agnosticValidators.forEach(validator => {
          const agnosticValidatorCaughtErrors: Partial<Record<keyof Values, string>> = validator(form.values) as any;
          const fieldsWithErrorsCaughtByAgnosticValidator: (keyof Values)[] = Object.keys(agnosticValidatorCaughtErrors);
          fieldsWithErrorsCaughtByAgnosticValidator.forEach(field => {
            if (this.isDisabled(field)) return;

            if (typeof errors[field] !== 'undefined') {
              errors[field]!.push(agnosticValidatorCaughtErrors[field]!);
            } else {
              errors[field] = [agnosticValidatorCaughtErrors[field]!];
            }
          });
        });
      }

      form.errors = errors;
    }));

    return this.isValid();
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
    return !this.isInvalid();
  }

  /**
    * @description Checks weather or not the form is invalid.
    */
  isInvalid(): boolean {
    const fieldsWithErrorObject: (keyof Values)[] = Object.keys(this.form.errors);
    return fieldsWithErrorObject.some(
      (key) => this.form.errors[key]!.length > 0,
    );
  }

  /**
    * @description Gets the first error for the field with the specified
    * `name`.
    */
  firstErrorFor(name: keyof Values): string | undefined {
    if (typeof this.form.errors[name] !== 'undefined') {
      return this.form.errors[name]![0];
    }
  }

  getErrors(name: keyof Values): string[] | undefined {
    if (typeof this.form.errors[name] === 'undefined') return undefined;

    // traverses through the errors so that Solid tracks them
    // and the return value of this method is reactive
    deeplyTrack(this.form.errors[name]);

    return this.form.errors[name];
  }

  hasErrors(name: keyof Values): boolean {
    return typeof this.form.errors[name] !== 'undefined'
      ? typeof this.form.errors[name]![0].length !== 'undefined'
      : false;
  }

  valueFor(name: keyof Values): Values[keyof Values] | undefined {
    const value = this.form.values[name];
    deeplyTrack(value);
    return value;
  }

  update(name: keyof Values, newValue: Values[keyof Values]): void {
    this.setForm(produce(form => {
      form.values[name] = newValue;
    }));
  }
}

export const FormContext = createContext<FormProviderValue<FormValue>>();
