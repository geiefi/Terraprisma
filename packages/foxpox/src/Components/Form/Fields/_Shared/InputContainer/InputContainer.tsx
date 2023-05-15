import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import { useDepth } from "../../../../General/Box/Box";

import './InputContainer.scss';

export type InputContainerProps = ParentProps<{
  id: Accessor<string>;
  label?: JSX.Element;
  class?: string,
  classList?: Record<string, boolean | undefined>,
  style?: JSX.CSSProperties,

  ref?: (inputContainer: HTMLDivElement) => any,

  focused: Accessor<boolean>,
  hasContent: Accessor<boolean>,
  disabled: Accessor<boolean>,

  onClick?: (event: MouseEvent) => any,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  const depth = useDepth() || (() => 0);

  return <div 
    class={`input-container ${props.class || ''}`}
    ref={props.ref}
    style={props.style}
    classList={{
      focused: props.focused(),
      'has-content': props.hasContent(),
      disabled: props.disabled ? props.disabled() : false,

      'inside-box': depth() > 0,

      ...props.classList
    }}
    onClick={props.onClick}
  >
    {props.label && <label for={props.id()}>{props.label}</label>}
    {props.children}
  </div>;
};

export default InputContainer;
