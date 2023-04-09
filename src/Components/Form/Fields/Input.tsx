import { Component, createMemo, createSignal, JSX, onCleanup, onMount } from 'solid-js';

import { useForm } from '../Form';

import { FieldValidator } from '../FormContext';

import './Input.scss';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps {
  name: string;
  type?: 'text' | 'number' | 'email' | 'password';
  label?: JSX.Element;
  // TODO: implement placeholder treatment
  placeholder?: string;
  helperText?: JSX.Element;
  validators?: FieldValidator[];
  onChange?: (event: InputOnChangeEvent) => any,
}

const Input: Component<InputProps> = (props) => {
  const [_formStore, form] = useForm();

  const value = createMemo(() => (form.valueFor(props.name) || '').toString());

  onMount(() => {
    if (typeof form.valueFor(props.name) !== 'undefined') {
      form.cleanUp(props.name);
    }

    form.init(props.name, props.validators || [], value());
  });

  onCleanup(() => {
    form.cleanUp(props.name);
  });

  const id = createMemo(() => `input-${form.identification()}-${props.name}`);

  const [focused, setFocused] = createSignal<boolean>(false);

  return <div class='form-control' classList={{ error: form.hasErrors(props.name) }}>
    <div
      class='input-container'
      classList={{
        focused: focused(),
        hasContent: value().length > 0
      }}
    >
      {props.label && <label for={id()}>{props.label}</label>}
      <input
        id={id()}
        value={value()}
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
    </div>
    <div class='helper-text'>
      {form.hasErrors(props.name)
        ? form.firstErrorFor(props.name)
        : props.helperText}
      &nbsp;
    </div>
  </div>;
};

export default Input;
