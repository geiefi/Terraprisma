import { Component, JSX, splitProps } from 'solid-js';

import './Input.scss';
import { FieldPropKeys, FieldProps, setupField } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';
import { mergeClass } from '../../../_Shared/Utils';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps extends FieldProps, Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name' | 'value'> {
  type?: 'text' | 'number' | 'email' | 'password';

  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (value: string, event?: InputOnChangeEvent) => void,
  onFocus?: () => void,
}

const Input: Component<InputProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    [...FieldPropKeys, 'type', 'label', 'helperText', 'color', 'onChange', 'onFocus']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    focusedSignal: [focused, setFocused],
    valueSignal: [value, setValue],
    validate,
    hasContent,
  } = setupField(props);

  return <FieldInternalWrapper
    name={props.name}
    errors={errors}
    helperText={props.helperText}
    renderHelperText={
      (typeof props.validators !== 'undefined' 
        && props.validators.length !== 0) 
      || typeof props.helperText !== 'undefined'
    }
    isDisabled={disabled()}
  >
    <InputContainer
      hasContent={hasContent()}
      focused={focused()}
      color={props.color}
      disabled={disabled()}
      label={props.label}
    >
      <input
        {...elProps}
        id={id()}
        value={(value() || '').toString()}

        type={props.type || 'text'}
        disabled={disabled()}

        class={mergeClass('input', elProps.class)}
        classList={{
          'no-label': typeof props.label === 'undefined',
        }}

        onInput={(event) => {
          if (typeof elProps.onInput === 'function') {
            elProps.onInput(event);
          }
          if (props.onChange) {
            props.onChange(event.currentTarget.value, event);
          }

          setValue(event.currentTarget.value);
        }}
        onFocus={() => {
          if (props.onFocus) {
            props.onFocus();
          }
          setFocused(true);
        }}
        onBlur={(event) => {
          if (typeof elProps.onBlur === 'function') {
            elProps.onBlur(event);
          }
          validate(value());
          setFocused(false);
        }}
      />
    </InputContainer>
  </FieldInternalWrapper>;
};

export default Input;
