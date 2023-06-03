import { Component, JSX, splitProps } from 'solid-js';

import { FieldPropKeys, FieldProps, setupField } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

import './TextArea.scss';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextAreaProps extends FieldProps, Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'name' | 'value'> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any,
  onFocus?: () => any,
}

const TextArea: Component<TextAreaProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    [...FieldPropKeys, 'label', 'helperText', 'color', 'onChange', 'onFocus']
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
    isDisabled={disabled()}
    errors={errors}
    renderHelperText={
      (typeof props.validators !== 'undefined' 
        && props.validators.length !== 0) 
      || typeof props.helperText !== 'undefined'
    }
    helperText={props.helperText}
  >
    <InputContainer
      hasContent={hasContent()}
      focused={focused()}
      disabled={disabled()}
      color={props.color}
      label={props.label}
    >
      <textarea
        {...elProps}
        id={id()}
        value={(value() || '').toString()}
        disabled={disabled()}
        class={elProps.class}
        classList={{ 
          'no-label': typeof props.label === 'undefined',
          ...elProps.classList
        }}
        onInput={(event) => {
          event.target.style.height = "0px";
          const scrollHeight = Math.max(
            event.target.scrollHeight, 
            54
          );
          event.target.style.height = `${scrollHeight}px`;

          event.target.parentElement!.style.height = `${scrollHeight}px`;

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
        onBlur={(e) => {
          if (typeof elProps.onBlur === 'function') {
            elProps.onBlur(e);
          }

          validate(value());
          setFocused(false);
        }}
      />
    </InputContainer>
  </FieldInternalWrapper>;
};

export default TextArea;
