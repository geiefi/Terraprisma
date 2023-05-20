import { Component, JSX } from 'solid-js';

import { FieldProps, setupField } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

import './TextArea.scss';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextAreaProps extends FieldProps {
  label?: JSX.Element;
  placeholder?: string;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  rows?: number;
  cols?: number;

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any,
  onFocus?: () => any,
}

const TextArea: Component<TextAreaProps> = (props) => {
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
    isDisabled={disabled()}
    errors={errors}
    helperText={props.helperText}
  >
    <InputContainer
      id={id()}
      hasContent={hasContent()}
      focused={focused()}
      disabled={disabled()}
      color={props.color}
      label={props.label}
    >
      <textarea
        id={id()}
        value={(value() || '').toString()}
        disabled={disabled()}
        placeholder={props.placeholder}
        rows={props.rows}
        cols={props.cols}
        classList={{ 
          'no-label': typeof props.label === 'undefined',
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
        onBlur={() => {
          validate(value());
          setFocused(false);
        }}
      />
    </InputContainer>
  </FieldInternalWrapper>;
};

export default TextArea;
