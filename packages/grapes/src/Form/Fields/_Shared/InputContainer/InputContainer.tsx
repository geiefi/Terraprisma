import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import { useDepth } from "../../../../General/Box/Box";

import './InputContainer.scss';

export type InputContainerProps = ParentProps<{
  id: Accessor<string>;
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary',

  class?: string,
  classList?: Record<string, boolean | undefined>,
  style?: JSX.CSSProperties,

  focused: Accessor<boolean>,
  hasContent: Accessor<boolean>,
  disabled: Accessor<boolean>,

  ref?: (inputContainer: HTMLDivElement) => any,
  onClick?: (event: MouseEvent) => any,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  const depth = useDepth() || (() => 0);

  return <div 
    class={`input-container ${props.class || ''}`}
    ref={props.ref}
    style={props.style}
    classList={{
      'primary': props.color === 'primary' || typeof props.color === 'undefined',
      'secondary': props.color === 'secondary',
      'tertiary': props.color === 'tertiary',

      focused: props.focused(),
      'has-content': props.hasContent(),
      disabled: props.disabled ? props.disabled() : false,

      'gray-2': depth() === 1 || depth() === 3,
      'gray-3': depth() === 2,
      // 'gray-2': depth() === 3,

      ...props.classList
    }}
    onClick={props.onClick}
  >
    {props.label && <label for={props.id()}>{props.label}</label>}
    {props.children}
  </div>;
};

export default InputContainer;
