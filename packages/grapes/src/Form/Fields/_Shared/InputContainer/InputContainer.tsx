import { Component, JSX, Show, splitProps } from "solid-js";

import { useDepth } from "../../../../General/Box/Box";
import { mergeClass } from "../../../../_Shared/Utils";
import Label from "../Label/Label";

import './InputContainer.scss';

export interface InputContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  labelFor: string;
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary',
  icon?: JSX.Element;

  focused: boolean,
  hasContent: boolean,
  hasErrors: boolean;
  disabled: boolean,
}

const InputContainer: Component<InputContainerProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    ['labelFor', 'label', 'color', 'icon', 'focused', 'hasContent', 'hasErrors', 'disabled']
  );

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
      <Label
        for={props.labelFor}
        hasErrors={props.hasErrors}
      >{props.label}</Label>
    </Show>

    {elProps.children}

    <span class='input-container-icon'>{props.icon}</span>
  </div>;
};

export default InputContainer;
