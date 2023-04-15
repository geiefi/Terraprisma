import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import './InputContainer.scss';

export type InputContainerProps = ParentProps<{
  id: Accessor<string>;
  label?: JSX.Element;
  focused: Accessor<boolean>,
  hasContent: Accessor<boolean>,
}>;

const InputContainer: Component<InputContainerProps> = (props) => {
  return <div 
    class='input-container'
    classList={{
      focused: props.focused(),
      hasContent: props.hasContent()
    }}
  >
    {props.label && <label for={props.id()}>{props.label}</label>}
    {props.children}
  </div>;
};

export default InputContainer;
