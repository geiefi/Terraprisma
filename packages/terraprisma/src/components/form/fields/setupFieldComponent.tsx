import {
  JSX,
  Signal,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  splitProps
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import { FieldContext } from './FieldContext';
import {
  FormFieldValue,
  FieldProps,
  FormValue,
  FieldName,
  FieldPropKeys
} from '../types';
import { setupCommunicationWithFormContext } from './setups/setupCommunicationWithFormContext';
import { setupFieldsValueSignal } from './setups/setupFieldValueSignal';
import { setupFieldsDisabledSignal } from './setups/setupFieldsDisabledSignal';
import {
  setupValidateFunction,
  FieldInternalValidate
} from './setups/setupValidateFunction';

export function setupFieldComponent<
  BaseValueType extends FormFieldValue = FormFieldValue
>() {
  return {
    with<
      MProps extends FieldProps<
        FormValue,
        BaseValueType,
        FieldName<FormValue, BaseValueType>
      >
    >(
      componentFunc: (props: MProps) => JSX.Element,
      initialValueParam:
        | (MProps['value'] & BaseValueType)
        | ((props: MProps) => MProps['value'] & BaseValueType) = '' as any
    ) {
      return <
        OwnerFormValue extends FormValue,
        Name extends FieldName<OwnerFormValue, BaseValueType> = FieldName<
          OwnerFormValue,
          BaseValueType
        >,
        Props extends MProps &
          FieldProps<OwnerFormValue, BaseValueType, Name> = MProps &
          FieldProps<OwnerFormValue, BaseValueType, Name>
      >(
        props: Props
      ) => {
        const [errors, setErrors] =
          // eslint-disable-next-line solid/reactivity
          props.errorsStore || createStore<string[]>([]);

        const initialValue = (
          typeof initialValueParam === 'function'
            ? initialValueParam(props)
            : initialValueParam
        ) as Props['value'];

        const form = setupCommunicationWithFormContext<
          Name,
          Props,
          BaseValueType,
          OwnerFormValue
        >(props, initialValue);
        const [value, setValue] = setupFieldsValueSignal<
          Name,
          Props,
          BaseValueType,
          OwnerFormValue
        >(props, form, initialValue);
        const validate = setupValidateFunction<
          Name,
          Props,
          BaseValueType,
          OwnerFormValue
        >(props, setErrors, form);

        const id = createMemo(() =>
          form
            ? `field-${form.identification()}-${props.name}`
            : `field-${props.name}`
        );

        const hasContent = createMemo(
          () => (value() || '').toString().length > 0
        );
        const hasErrors = createMemo(
          () =>
            errors && Array.isArray(errors) && typeof errors[0] !== 'undefined'
        );

        const disabledSignal = setupFieldsDisabledSignal<
          Name,
          BaseValueType,
          Props,
          OwnerFormValue
        >(props, form);
        // eslint-disable-next-line solid/reactivity
        const [focused, setFocused] = createSignal<boolean>(false);

        createEffect(() => {
          setFocused((f) => props.focused ?? f);
        });

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
              )[0] as unknown as FieldProps<FormValue> & {
                value: FormFieldValue;
              },

              hasContent,
              hasErrors,

              validate: validate as FieldInternalValidate
            }}
          >
            <Dynamic component={componentFunc} {...props} />
          </FieldContext.Provider>
        );
      };
    }
  };
}
