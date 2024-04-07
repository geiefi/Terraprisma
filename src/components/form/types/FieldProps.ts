import type { FieldValidator, FormFieldValue, FormValue } from '.';
import { JSX } from 'solid-js/jsx-runtime';
import { DeepGet, EmptyObj, AllKeysOfObject, StoreTuple } from '../../../types';

export const FieldPropKeys = [
  'name',
  'manuallyControlled',
  'value',
  'validators',
  'disabled',
  'focused',
  'validateOnStartup',
  'helperText',
  'errorsStore'
] as const;

// export type FieldName<OwnerFormValue extends FormValue, ValueType = any> = OwnerFormValue extends EmptyObj ? string
//   : { [K in keyof OwnerFormValue]: OwnerFormValue[K] extends ValueType ? K : never }[keyof OwnerFormValue];

export type FieldName<
  OwnerFormValue extends FormValue,
  ValueType = any
> = OwnerFormValue extends EmptyObj
  ? string
  : AllKeysOfObject<OwnerFormValue, ValueType>;

/**
 * The field props that are required for all of the fields used in conjunction with the `<Form />`
 * component
 */
export interface FieldProps<
  OwnerFormValue extends FormValue = EmptyObj,
  BaseValueType extends FormFieldValue = FormFieldValue,
  Name extends FieldName<OwnerFormValue, BaseValueType> = FieldName<
    OwnerFormValue,
    BaseValueType
  >
> {
  /**
   * @description This is the identification of the field basically. If it is inside a `<Form>`
   * it is used to identify the field's value, field's errors and field's validators inside of it.
   *
   * Currently it is not used if it is outside a `<Form>` but is still important for errors.
   */
  name: Name;

  /**
   * @description Defines weather or not the state of the field is communicated across to the nearest `<Form>` or be manually controlled.
   *
   * This is useful when you need to manually controll a field even though it is inside a `<Form>`.
   *
   * This prop makes no difference when there is no `<Form>` above the field.
   *
   * @default false
   */
  manuallyControlled?: boolean;

  /**
   * @description Validators of the field.
   *
   * Basically just a function that receives the current value of the field once unfocused,
   * and returns either a **string** of an error message when it is invalid or **undefined**
   * when it is valid.
   *
   * There are some basic validators implemented under the `Validators` const.
   */
  validators?: FieldValidator<BaseValueType & DeepGet<OwnerFormValue, Name>>[];

  /**
   * @description A store containing all of the errors of the field.
   *
   * This store is to be used when manually trying to control a Field
   * without any parent `<Form>`.
   */
  errorsStore?: StoreTuple<string[]>;

  /**
   * @description Defines if this field is disabled or not.
   *
   * This is propagated above inside a Form so it is accessible through the Form's store.
   */
  disabled?: boolean;

  /**
   * @description Weather or not the current field is focused.
   * For some fields this is currently ignored, since they can't really be focused.
   *
   * @default false
   */
  focused?: boolean;

  /**
   * @description Weather or not the validation should take place on startup of the field.
   *
   * @default false
   */
  validateOnStartup?: boolean;

  /**
   * @description Defines a value that will override the current value of the state of the Field.
   * ---
   * Will be ignored when there is a form above the field. This is because its value can
   * be set in other better ways.
   */
  value?: BaseValueType & DeepGet<OwnerFormValue, Name>;

  helperText?: JSX.Element;
}

