import { InputMask } from '@solid-primitives/input-mask';

import { FieldName, FieldPropKeys, FieldProps } from './FieldProps';
import type { FormValue, FormFieldValue } from '.';
import { EmptyObj } from '../../../types';

export const MaskedFieldPropsKeys: (keyof MaskedFieldProps)[] = [
  ...FieldPropKeys,
  'mask'
];

export type MaskedFieldProps<
  OwnerFormValue extends FormValue = EmptyObj,
  BaseValueType extends FormFieldValue = FormFieldValue,
  Name extends FieldName<OwnerFormValue> = FieldName<OwnerFormValue>
> = FieldProps<OwnerFormValue, BaseValueType, Name> & {
  /**
   * @description The mask that should be applied to the field.
   *
   * This can be one of:
   * - an array of masks (regex or string) for each character that can be in the field,
   * - a function that directly determines a new **value** and **selection** from the current **value** and **selection**,
   * - a mask regex tuple that contains the **regex** and then a replacer function to replace each matching character with,
   * - a simple string that will be converted into *an array of masks* again as follows:
   *     \* 9 -> /\d/;
   *     \* a -> /[a-z]/i;
   *     \* * -> /\w/i;
   *     \* Any other character -> itself.
   *
   * The mask functionality in GrapeS is taken from solid primitives's
   * [input-mask](https://github.com/solidjs-community/solid-primitives/tree/main/packages/input-mask).
   */
  // TODO: find a way of disallowing this field instead of setting its type to never
  mask?: BaseValueType extends string ? InputMask : never;
}
