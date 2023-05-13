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
  onClick?: (event: MouseEvent) => any,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  const depth = useDepth() || (() => 0);

  return <div 
    class={props.class 
      ? props.class + ' input-container'
      : 'input-container'}
    ref={props.ref}
    style={props.style}
    classList={{
      focused: props.focused(),
      hasContent: props.hasContent(),

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
