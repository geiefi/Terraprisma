import { Component, JSX } from 'solid-js';

import './Input.scss';
import { FieldProps, setupField } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps extends FieldProps {
  type?: 'text' | 'number' | 'email' | 'password';

  label?: JSX.Element;
  placeholder?: string;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (value: string, event?: InputOnChangeEvent) => any,
  onFocus?: () => any,
}

const Input: Component<InputProps> = (props) => {
  const {
    elementId: id,
    errorsStore: [errors, _setErrors],
    disabledSignal: [disabled, _setDisabled],
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
        id={id()}
        value={(value() || '').toString()}
        type={props.type || 'text'}
        disabled={disabled()}
        placeholder={props.placeholder}
        classList={{
          'no-label': typeof props.label === 'undefined',
        }}
        onInput={(event) => {
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
        onBlur={() => {
          validate(value());
          setFocused(false);
        }}
      />
    </InputContainer>
  </FieldInternalWrapper>;
};

export default Input;
