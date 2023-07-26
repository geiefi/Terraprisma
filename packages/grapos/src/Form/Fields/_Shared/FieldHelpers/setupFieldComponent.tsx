import {
  JSX,
  Signal,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import { FieldContext } from './FieldContext';

import { setupValidateFunction } from './setupValidateFunction';
import { setupCommunicationWithFormContext } from './setupCommunicationWithFormContext';
import { setupFieldsValueSignal } from './setupFieldValueSignal';
import { setupFieldsDisabledSignal } from './setupFieldsDisabledSignal';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';
import { FieldName, FieldPropKeys, FieldProps } from '../Types/FieldProps';

export function setupFieldComponent<
  BaseValueType extends FormFieldValue,

  MProps extends FieldProps<FormValue, BaseValueType>,
>(
  componentFunc: (
    props: MProps
  ) => JSX.Element,
  initialValueParam: BaseValueType | ((props: MProps) => BaseValueType) = '' as any
) {
  return <
    OwnerFormValue extends FormValue,
    Name extends FieldName<OwnerFormValue, BaseValueType> = FieldName<OwnerFormValue, BaseValueType>,

    Props extends MProps & FieldProps<OwnerFormValue, BaseValueType, Name> = MProps & FieldProps<OwnerFormValue, BaseValueType, Name>,
  >(props: Props) => {
    // eslint-disable-next-line solid/reactivity
    const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

    const initialValue = typeof initialValueParam === 'function'
      ? initialValueParam(props as unknown as MProps)
      : initialValueParam;

    const form = setupCommunicationWithFormContext(
      props,
      initialValue
    );
    const [value, setValue] = setupFieldsValueSignal(
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
    // eslint-disable-next-line solid/reactivity
    const [focused, setFocused] = createSignal<boolean>(false);

    createEffect(() => setFocused(props.focused || false));

    onMount(() => {
      if (props.validateOnStartup) {
        validate(value());
      }
    });

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
          )[0] as unknown as FieldProps<OwnerFormValue> & { value: FormFieldValue },

          hasContent,
          hasErrors,

          validate,
        }}
      >
        <Dynamic component={(props: Props) => componentFunc(props)} {...props} />
      </FieldContext.Provider>
    );
  };
}