import { batch, createContext, Setter } from 'solid-js';
import { produce, SetStoreFunction } from 'solid-js/store';

import {
  DeepGet,
  deeplyTrack,
  EmptyObj,
  AllKeysOfObject,
  StoreTuple
} from '../..';

import { AgnosticValidator, FieldValidator, FormFieldValue, FormValue } from './types';
import { trackDeep } from '@solid-primitives/deep';

export class FormError extends Error {}

/**
 * @example
 * ```typescript
 * const formStore = createStore<FormStore<MyFormValueType>>(new FormStore({
 *   // all of my default field values
 * }))
 * ```
 */
export class FormStore {
  /**
   * A array of field names that are currently disabled
   */
  disabled: Partial<Record<string, boolean>>;
  errors: Partial<Record<string, string[]>>;
  validators: Partial<Record<string, FieldValidator[]>>;

  constructor() {
    this.disabled = {};
    this.validators = {};
    this.errors = {};
  }
}

function isObject(thing: any): thing is object {
  return typeof thing === 'object' && !(thing instanceof Date);
}

export function getByPath(obj: any, path: string | string[]): any {
  const pathArr = Array.isArray(path) ? path : path.split('.');
  const cursorKey = pathArr[0];
  if (isObject(obj[cursorKey]) && pathArr.length > 1) {
    return getByPath(obj[cursorKey], pathArr.slice(1));
  } else {
    return obj[cursorKey];
  }
}

function getLeaves(obj: any): string[] {
  const resultingKeys = [];

  for (const key of Object.keys(obj)) {
    if (isObject(obj[key])) {
      resultingKeys.push(...getLeaves(obj[key]).map((l) => `${key}.${l}`));
    } else {
      resultingKeys.push(key);
    }
  }

  return resultingKeys;
}

export function setByPath(obj: any, path: string | string[], value: any): void {
  const pathArr = Array.isArray(path) ? path : path.split('.');
  const cursorKey = pathArr[0];

  if (typeof obj[cursorKey] === 'undefined' && pathArr.length > 1) {
    obj[cursorKey] = {};
  }

  if (isObject(obj[cursorKey]) && pathArr.length > 1) {
    setByPath(obj[cursorKey], pathArr.slice(1), value);
  } else {
    obj[cursorKey] = value;
  }
}

export function deepDelete(obj: any, path: string | string[]): void {
  const pathArr = Array.isArray(path) ? path : path.split('.');
  const cursorKey = pathArr[0];

  if (isObject(obj[cursorKey]) && pathArr.length > 1) {
    deepDelete(obj[cursorKey], pathArr.slice(1));
  } else {
    delete obj[cursorKey];
  }
}

export type FieldRequiredProperties<V extends FormFieldValue = FormFieldValue> = {
  disabled?: boolean;
  'aria-disabled'?: boolean;
  isInvalid?: boolean;
  value?: V;
  onInstantChange?: (value: V, event?: Event) => any;
};

/**
 * This is going to be the value that comes from `createForm()` 
 */
export class Form<
  T extends FormValue,
  Values extends FormValue = Partial<T>,
  Paths extends T extends EmptyObj
    ? string
    : AllKeysOfObject<T> = T extends EmptyObj ? string : AllKeysOfObject<T>
> {
  private values: Values;
  private setValues: SetStoreFunction<Values>;

  private form: FormStore;
  private setForm: Setter<FormStore>;

  // this doesn't really need to be reactive
  private __isCleaningUp: boolean;

  constructor(
    public store: StoreTuple<FormStore>,
    public valuesStore: StoreTuple<Values>,
    public agnosticValidators: AgnosticValidator[],
    private _identification: string
  ) {
    this.values = valuesStore[0];
    this.setValues = valuesStore[1];

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
  register<Name extends Paths>(
    name: Name,
    validators: FieldValidator<DeepGet<Values, Name>>[] = []
  ) {
    batch(() => {
      this.setForm(
        produce((form) => {
          form.validators[name] = validators as any;
        })
      );
    });

    const provider = this;
    return {
      get value() {
        const value = getByPath(provider.values, name);
        deeplyTrack(value);
        return value;
      },
      get disabled() {
        return provider.form.disabled[name];
      },
      get 'aria-disabled'() {
        return provider.form.disabled[name];
      },
      get isInvalid() {
        return provider.hasErrors(name);
      },
      onInstantChange: (newValue: DeepGet<Values, Name>) => {
        this.setValues(produce(values => {
          setByPath(values, name, newValue);
        }));
      }
    } satisfies FieldRequiredProperties;
  }

  /**
   * @description Removes all of the references inside of the formStore that
   * are associated with the field identified by `name` except for its value.
   */
  delete(name: Paths): void {
    this.setForm(
      produce((form) => {
        delete form.errors[name];
        delete form.validators[name];
      })
    );
  }

  /**
   * @description Runs over all of the validators of the field with the specified
   * `name` and adds the errors to the field if necessary, thus making it invalid.
   */
  validate(name: Paths): void {
    if (this.isDisabled(name)) return;

    const formValueKeys: string[] = getLeaves(this.values);
    if (!formValueKeys.includes(name)) {
      throw new FormError(
        `Cannot validate the field named "${name}" inside of the form with identification` +
          ` ${this.identification()} because it does not exist!
Maybe you forgot to initialize it?`
      );
    } else {
      this.setForm(
        produce((form) => {
          const validators = form.validators[name] || [];
          const value = getByPath(this.values, name);
          const errors = validators
            .map((validator) => validator(value)!)
            .flat()
            .filter(Boolean);
          form.errors[name] = errors;
        })
      );
    }
  }

  /**
   * @description Validates all of the fields and then uses all of the agnostic
   * validators associated with the form.
   */
  validateAll(): boolean {
    this.setForm(
      produce((form) => {
        // the validators just use the field paths for more usability
        const fields = Object.keys(form.validators) as Paths[];
        const errors: Partial<Record<Paths, string[]>> = {};

        fields.forEach((field) => {
          if (this.isDisabled(field as any)) return;

          const validators = (form.validators as any)[field]!;
          const value = getByPath(this.values, field);
          const caughtErrors = validators
            .map((validator: FieldValidator) => validator(value)!)
            .flat()
            .filter(Boolean);
          (errors as any)[field] = caughtErrors;
        });

        if (this.agnosticValidators) {
          this.agnosticValidators.forEach((validator) => {
            const agnosticValidatorCaughtErrors: Partial<
              Record<Paths, string>
            > = validator(this.values) as any;
            const fieldsWithErrorsCaughtByAgnosticValidator: Paths[] =
              Object.keys(agnosticValidatorCaughtErrors) as Paths[];
            fieldsWithErrorsCaughtByAgnosticValidator.forEach((field) => {
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
      })
    );

    return this.isValid();
  }

  isDisabled(name: Paths): boolean {
    return this.form.disabled[name] || false;
  }

  setDisabled(name: Paths, disabled: boolean): void {
    this.setForm(
      produce((form) => {
        form.disabled[name] = disabled;
        form.errors[name] = [];
      })
    );
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
    const fieldsWithErrorObject: Paths[] = Object.keys(
      this.form.errors
    ) as Paths[];
    return fieldsWithErrorObject.some(
      (key) => this.form.errors[key]!.length > 0
    );
  }

  /**
   * @description Gets the first error for the field with the specified
   * `name`.
   */
  firstErrorFor(name: Paths): string | undefined {
    if (typeof this.form.errors[name] !== 'undefined') {
      return this.form.errors[name]![0];
    }
  }

  getErrors(name: Paths): string[] | undefined {
    if (typeof this.form.errors[name] === 'undefined') return undefined;

    // traverses through the errors so that Solid tracks them
    // and the return value of this method is reactive
    deeplyTrack(this.form.errors[name]);

    return this.form.errors[name];
  }

  hasErrors(name: Paths): boolean {
    return typeof this.form.errors[name] !== 'undefined'
      ? this.form.errors[name]!.length > 0
      : false;
  }

  valueFor<Name extends Paths>(name: Name): DeepGet<Values, Name> | undefined {
    const value = getByPath(this.values, name);
    deeplyTrack(value);
    return value;
  }

  update<Name extends Paths>(
    name: Name,
    newValue: DeepGet<Values, Name>
  ): void {
    const namePath = name.split('.');
    // setValues does support passing in any size of paths to set through here,
    // its types are limited though, so this is necessary
    (this.setValues as any)(...namePath, newValue);
  }
}

export const FormContext = createContext<Form<FormValue>>();
