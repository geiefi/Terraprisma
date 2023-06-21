import {
  Component,
  Signal,
  createMemo,
  createSignal,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FieldContext } from './FieldContext';
import { FormValue } from '../../../Types/FormValue';

import { FieldPropKeys, FieldProps } from '../Types/FieldProps';

import { setupValidateFunction } from './setupValidateFunction';
import { setupCommunicationWithFormContext } from './setupCommunicationWithFormContext';
import { setupFieldsValueSignal } from './setupFieldValueSignal';
import { setupFieldsDisabledSignal } from './setupFieldsDisabledSignal';

export function setupFieldComponent<
  Props extends FieldProps,
  OwnerFormValue extends FormValue = FormValue,
  ValueType extends FormFieldValue = FormFieldValue
>(
  componentFunc: Component<Props>,
  initialValueParam: ValueType | ((props: Props) => ValueType) = '' as any
): Component<Props> {
  return (props) => {
    // eslint-disable-next-line solid/reactivity
    const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

    const initialValue = typeof initialValueParam === 'function' ? initialValueParam(props) : initialValueParam;

    const form = setupCommunicationWithFormContext<Props, OwnerFormValue>(
      props,
      initialValue
    );
    const [value, setValue] = setupFieldsValueSignal<
      Props,
      OwnerFormValue,
      ValueType
    >(
      props,
      form,
      initialValue
    );
    const validate = setupValidateFunction(props, setErrors, form);

    const id = createMemo(() =>
      form
        ? `field-${form.identification()}-${props.name}`
        : `field-${props.name}`
    );

    const hasContent = createMemo(() => (value() || '').toString().length > 0);
    const hasErrors = createMemo(
      () => errors && Array.isArray(errors) && typeof errors[0] !== 'undefined'
    );

    const disabledSignal = setupFieldsDisabledSignal(props, form);
    const [focused, setFocused] = createSignal<boolean>(false);

    return (
      <FieldContext.Provider
        value={{
          elementId: id,
          errorsT: [errors, setErrors],

          valueS: [value, setValue] as Signal<FormFieldValue>,
          disabledS: disabledSignal,
          focusedS: [focused, setFocused],

          fieldProps: splitProps(
            props,
            FieldPropKeys
          )[0] as unknown as FieldProps,

          hasContent,
          hasErrors,

          validate,
        }}
      >
        <Dynamic component={componentFunc} {...props} />
      </FieldContext.Provider>
    );
  };
}