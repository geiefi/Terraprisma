import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import './InputContainer.scss';

export type InputContainerProps = ParentProps<{
  id: Accessor<string>;
  label?: JSX.Element;
  focused: Accessor<boolean>,
  hasContent: Accessor<boolean>,
  style?: JSX.CSSProperties,
  ref?: (inputContainer: HTMLDivElement) => any,
  onClick?: (event: MouseEvent) => any,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  return <div 
    class='input-container'
    ref={props.ref}
    style={props.style}
    classList={{
      focused: props.focused(),
      hasContent: props.hasContent()
    }}
    onClick={props.onClick}
  >
    {props.label && <label for={props.id()}>{props.label}</label>}
    {props.children}
  </div>;
};

export default InputContainer;
