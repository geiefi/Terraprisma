import { Component, createMemo, createSignal, JSX } from 'solid-js';

import './Input.scss';
import { FieldProps, setupCommunicationWithFormContext } from '../_Shared/Utilts';
import InputContainer from '../_Shared/InputContainer/InputContainer';
import FormControl from '../_Shared/FormControl/FormControl';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps extends FieldProps {
  type?: 'text' | 'number' | 'email' | 'password';
  label?: JSX.Element;
  // TODO: implement placeholder treatment
  placeholder?: string;
  helperText?: JSX.Element;
  onChange?: (event: InputOnChangeEvent) => any,
}

const Input: Component<InputProps> = (props) => {
  const {form, value} = setupCommunicationWithFormContext(props);

  const id = createMemo(() => `input-${form.identification()}-${props.name}`);

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
      label={props.label}
    >
      <input
        id={id()}
        value={(value() || '').toString()}
        type={props.type || 'text'}
        classList={{ 'no-label': typeof props.label === 'undefined' }}
        onChange={(event) => {
          if (props.onChange) {
            props.onChange(event);
          }

          form.update(props.name, event.currentTarget.value);
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          form.validate(props.name);
          setFocused(false);
        }}
      />
    </InputContainer>
  </FormControl>;
};


// <div
//   class='input-container'
//   classList={{
//     focused: focused(),
//     hasContent: (value() || '').toString().length > 0
//   }}
// >
//   {props.label && <label for={id()}>{props.label}</label>}
// </div>

export default Input;
