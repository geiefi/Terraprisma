import { createContext } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export type FieldValue = string | string[] | number | boolean | Date;

export type FormValue = Record<string, FieldValue>;

export type FieldValidator<ValueType = FieldValue> = (value: ValueType) => string | undefined;

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
  init(name: string, validators: FieldValidator[], value: FieldValue): void;
  cleanUp(name: string): void;
  validate(name: string): void;
  validateAll(): void;
  isValid(): boolean;
  isInvalid(): boolean;
  firstErrorFor(name: string): string | undefined;
  hasErrors(name: string): boolean;
  valueFor(name: string): FieldValue | undefined;
  update(name: string, newValue: FieldValue): void;
}

export type FormProvider<T extends FormValue> = [
  formStore: [get: FormStore<T>, set: SetStoreFunction<FormStore<T>>],
  actions: FormActions,
];

export const FormContext = createContext<FormProvider<FormValue>>();
