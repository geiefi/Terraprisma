import { Accessor, Component, JSX, ParentProps, Show } from "solid-js";

import { useDepth } from "../../../../General/Box/Box";

import './InputContainer.scss';

export type InputContainerProps = ParentProps<{
  id: string;
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary',

  class?: string,
  classList?: Record<string, boolean | undefined>,
  style?: JSX.CSSProperties,

  focused: boolean,
  hasContent: boolean,
  disabled: boolean,

  ref?: (inputContainer: HTMLDivElement) => any,
  onClick?: (event: MouseEvent) => any,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  const depth = useDepth() || (() => 0);

  return <div
    id={props.id}
    class={`input-container ${props.class || ''}`}
    ref={props.ref}
    style={props.style}
    classList={{
      'primary': props.color === 'primary' || typeof props.color === 'undefined',
      'secondary': props.color === 'secondary',
      'tertiary': props.color === 'tertiary',

      focused: props.focused,
      'has-content': props.hasContent,
      disabled: props.disabled,

      'gray-2': depth() === 1 || depth() === 3,
      'gray-3': depth() === 2,
      // 'gray-2': depth() === 3,

      ...props.classList
    }}
    onClick={props.onClick}
  >
    <Show when={props.label}>
      <label for={props.id}>{props.label}</label>
    </Show>
    {props.children}
  </div>;
};

export default InputContainer;
