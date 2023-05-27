import { Component, JSX, Show, splitProps } from "solid-js";

import { useDepth } from "../../../../General/Box/Box";
import { mergeClass } from "../../../../_Shared/Utils";

import './InputContainer.scss';

export interface InputContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary',
  icon?: JSX.Element;

  focused: boolean,
  hasContent: boolean,
  disabled: boolean,
}

const InputContainer: Component<InputContainerProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['id', 'label', 'color', 'icon', 'focused', 'hasContent', 'disabled']);

  const depth = useDepth() || (() => 0);

  return <div
    {...elProps}
    class={mergeClass('input-container', elProps.class)}
    classList={{
      'primary': props.color === 'primary' || typeof props.color === 'undefined',
      'secondary': props.color === 'secondary',
      'tertiary': props.color === 'tertiary',

      focused: props.focused,
      'has-content': props.hasContent,
      disabled: props.disabled,

      'gray-2': depth() === 1 || depth() === 3,
      'gray-3': depth() === 2,

      ...elProps.classList
    }}
  >
    <Show when={props.label}>
      <label for={props.id}>{props.label}</label>
    </Show>

    {elProps.children}

    <span class='input-container-icon'>{props.icon}</span>
  </div>;
};

export default InputContainer;
