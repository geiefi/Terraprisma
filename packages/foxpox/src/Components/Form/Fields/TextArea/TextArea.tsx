import { Component, createMemo, createSignal, JSX, onMount } from 'solid-js';

import { FieldProps, setupCommunicationWithFormContext, setupFieldsDisabledSignal, setupFieldsValueSignal } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FormControl from '../_Shared/FormControl/FormControl';

import './TextArea.scss';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextAreaProps extends FieldProps {
  label?: JSX.Element;
  placeholder?: string;
  helperText?: JSX.Element;

  rows?: number;
  cols?: number;

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any,
  onFocus?: () => any,
}

const TextArea: Component<TextAreaProps> = (props) => {
  const form = setupCommunicationWithFormContext(props);
  const [value, setValue] = setupFieldsValueSignal(props, form);
  const [disabled, _setDisabled] = setupFieldsDisabledSignal(props, form);

  const id = createMemo(() => 
    form 
      ? `textarea-${form.identification()}-${props.name}`
      : `textarea-${props.name}`
  );

  const [focused, setFocused] = createSignal<boolean>(false);

  const hasContent = createMemo(() => (value() || '').toString().length > 0);

  return <FormControl 
    name={props.name} 
    helperText={props.helperText}
  >
    <InputContainer
      id={id}
      hasContent={hasContent}
      focused={focused}
      disabled={disabled}
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
          if (form) {
            form.validate(props.name);
          }
          setFocused(false);
        }}
      />
    </InputContainer>
  </FormControl>;
};

export default TextArea;
