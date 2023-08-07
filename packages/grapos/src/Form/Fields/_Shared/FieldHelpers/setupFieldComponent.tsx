import {
  ComponentProps,
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

import { FieldInternalValidate, setupValidateFunction } from './setupValidateFunction';
import { setupCommunicationWithFormContext } from './setupCommunicationWithFormContext';
import { setupFieldsValueSignal } from './setupFieldValueSignal';
import { setupFieldsDisabledSignal } from './setupFieldsDisabledSignal';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';
import { FieldName, FieldPropKeys, FieldProps } from '../Types/FieldProps';


export function setupFieldComponent<
  MProps extends FieldProps<FormValue, BaseValueType, FieldName<FormValue, BaseValueType>>,

  InternalElement extends keyof JSX.IntrinsicElements,
  BaseValueType extends FormFieldValue = FormFieldValue,
  ElProps extends Omit<ComponentProps<InternalElement>, keyof MProps>
    = Omit<ComponentProps<InternalElement>, keyof MProps>,
  PropKeys extends Array<keyof MProps> = Array<keyof MProps>,
>(
  componentFunc: (
    props: MProps,
    elProps: ElProps
  ) => JSX.Element,
  propKeys: PropKeys,
  initialValueParam: BaseValueType | ((props: MProps & ElProps) => BaseValueType) = '' as any
) {
  return <
    OwnerFormValue extends FormValue,
    Name extends FieldName<OwnerFormValue, BaseValueType> = FieldName<OwnerFormValue, BaseValueType>,


    Props extends MProps
    & FieldProps<OwnerFormValue, BaseValueType, Name> = MProps & FieldProps<OwnerFormValue, BaseValueType, Name>,

    AllProps extends Props & ElProps = Props & ElProps
  >(allProps: AllProps) => {
    const [props, elProps] = splitProps(allProps, propKeys) as unknown as [
      Props,
      ElProps
    ];

    // eslint-disable-next-line solid/reactivity
    const [errors, setErrors] = props.errorsStore || createStore<string[]>([]);

    const initialValue = (typeof initialValueParam === 'function'
      ? initialValueParam(allProps)
      : initialValueParam) as AllProps['value'];

    const form = setupCommunicationWithFormContext<
      Name,
      Props,
      BaseValueType,
      OwnerFormValue
    >(
      props,
      initialValue
    );
    const [value, setValue] = setupFieldsValueSignal<
      Name,
      Props,
      BaseValueType,
      OwnerFormValue
    >(
      props,
      form,
      initialValue
    );
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

    const hasContent = createMemo(() => (value() || '').toString().length > 0);
    const hasErrors = createMemo(
      () => errors && Array.isArray(errors) && typeof errors[0] !== 'undefined'
    );

    const disabledSignal = setupFieldsDisabledSignal<
      Name,
      BaseValueType,
      Props,
      OwnerFormValue
    >(props, form);
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
          )[0] as unknown as FieldProps<FormValue> & { value: FormFieldValue },

          hasContent,
          hasErrors,

          validate: validate as FieldInternalValidate,
        }}
      >
        <Dynamic 
          component={(p: {
            props: Props,
            elProps: ElProps
          }) => componentFunc(p.props, p.elProps)} 

          props={props} 
          elProps={elProps}
        />
      </FieldContext.Provider>
    );
  };
}