import {
  Accessor,
  JSX,
  Show,
  Signal,
  createEffect,
  createSignal,
  onMount,
  splitProps
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { FieldContext, FieldProviderValue } from './FieldContext';
import {
  FormFieldValue,
  FieldProps as BaseFieldProps,
  FormValue,
  FieldName,
  FieldPropKeys
} from '../../types';
import { createCommunicationWithFormContext } from './createCommunicationWithFormContext';
import { createFieldsValueSignal } from './createFieldValueSignal';
import { createFieldsDisabledSignal } from './createFieldsDisabledSignal';
import {
  createValidateFunction,
  FieldInternalValidate
} from './createValidateFunction';
import { Collapse } from '../../../transitions';
import { mergeClass } from '../../../../utils';

export function FormField<
  BaseValueType extends FormFieldValue = FormFieldValue,
  Name extends FieldName<FormValue, BaseValueType> = FieldName<
    FormValue,
    BaseValueType
  >,
  FieldProps extends BaseFieldProps<FormValue, FormFieldValue, Name> = BaseFieldProps<
    FormValue,
    FormFieldValue,
    Name
  >,
  Value extends FieldProps['value'] = FieldProps['value']
>(props: {
  /**
   * On this property it can be passed along anything that extends FieldProps
   * but deeper inside these props are split to only use the actual field props
   * only
   */
  fieldProperties: FieldProps;
  initialValue?: BaseValueType;
  children:
  | JSX.Element
  | ((field: FieldProviderValue<Value>) => JSX.Element);
}) {
  const [fieldProps] = splitProps(
    // eslint-disable-next-line solid/reactivity
    props.fieldProperties,
    FieldPropKeys
  ) as unknown as [BaseFieldProps<FormValue, BaseValueType>, unknown];
  const initialValue = () => props.initialValue ?? ('' as BaseValueType);

  const [errors, setErrors] =
    // eslint-disable-next-line solid/reactivity
    props.fieldProperties.errorsStore || createStore<string[]>([]);

  const form = createCommunicationWithFormContext<BaseValueType>(
    fieldProps,
    initialValue()
  );
  const [value, setValue] = createFieldsValueSignal<Value>(
    fieldProps as any,
    form,
    initialValue() as unknown as Value
  );
  const validate = createValidateFunction<Value>(
    fieldProps as any,
    setErrors,
    form
  );

  const id = () =>
    form
      ? `field-${form.identification()}-${props.fieldProperties.name}`
      : `field-${props.fieldProperties.name}`;

  const hasContent = () =>
    (Number.isNaN(value()) || value() === undefined ? '' : value()!.toString())
      .length > 0;
  const hasErrors = () =>
    errors && Array.isArray(errors) && typeof errors[0] !== 'undefined';

  const disabledSignal = createFieldsDisabledSignal<BaseValueType>(
    fieldProps,
    form
  );
  const [isDisabled] = disabledSignal;
  // eslint-disable-next-line solid/reactivity
  const [focused, setFocused] = createSignal<boolean>(false);

  createEffect(() => {
    setFocused((f) => props.fieldProperties.focused ?? f);
  });

  onMount(() => {
    if (props.fieldProperties.validateOnStartup) {
      validate(value());
    }
  });

  const fieldProviderValue = {
    elementId: id,
    errorsT: [errors, setErrors],

    valueS: [value, setValue] as Signal<Value>,
    disabledS: disabledSignal,
    focusedS: [focused, setFocused],

    fieldProps,

    hasContent,
    hasErrors,

    validate: validate as FieldInternalValidate
  } as FieldProviderValue<Value>;

  return (
    <FieldContext.Provider value={fieldProviderValue}>
      {typeof props.children === 'function'
        ? props.children(fieldProviderValue)
        : props.children}

      <Collapse>
        <Show when={fieldProps.helperText || hasErrors()}>
          <div
            class={mergeClass(
              'pt-1.5 opacity-80 text-sm font-bold',
              hasErrors() && 'font-extrabold text-[var(--danger-bg)]'
            )}
          >
            <Show
              when={hasErrors() && !isDisabled()}
              fallback={fieldProps.helperText}
            >
              {errors![0]}
            </Show>
          </div>
        </Show>
      </Collapse>
    </FieldContext.Provider>
  );
}
