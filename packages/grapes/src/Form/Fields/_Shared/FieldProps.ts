import { Store } from '../../../Helpers/Types/Store';

import { FieldValidator } from '../../Types/FieldValidator';
import { FormFieldValue } from '../../Types/FormFieldValue';

export const FieldPropKeys: (keyof FieldProps)[] = [
  'name',
  'manuallyControlled',
  'value',
  'validators',
  'disabled',
  'errorsStore'
];

/**
  * The field props that are required for all of the fields used in conjunction with the `<Form />`
  * component
  */
export interface FieldProps {
  /**
    * @description This is the identification of the field basically. If it is inside a `<Form>`
    * it is used to identify the field's value, field's errors and field's validators inside of it.
    *
    * Currently it is not used if it is outside a `<Form>` but is still important for errors.
    */
  name: string;

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
  validators?: FieldValidator[];

  /**
    * @description A store containing all of the errors of the field.
    *
    * This store is to be used when manually trying to control a Field
    * without any parent `<Form>`.
    */
  errorsStore?: Store<string[]>;

  /**
    * @description Defines if this field is disabled or not.
    * 
    * This is propagated above inside a Form so it is accessible through the Form's store.
    */
  disabled?: boolean;

  /**
   * @description Defines a value that will override the current value of the state of the Field.
   * ---
   * Will be ignored when there is a form above the field. This is because its value can 
   * be set in other better ways.
   */
  value?: FormFieldValue;
}

