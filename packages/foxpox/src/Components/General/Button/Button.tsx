import { Component, createMemo, JSX, ParentProps } from "solid-js";
import { useDepth } from "../Box/Box";
import Ripple from "../Ripple/Ripple";

import './Button.scss';

export type ButtonProps = ParentProps<{
  color?: 'primary' | 'secondary' | 'tertiary',
  size?: 'small' | 'medium' | 'large',
  type?: 'default' | 'empty',

  disabled?: boolean,

  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean>,

  onClick?: (event: MouseEvent) => any,
}>;

const Button: Component<ButtonProps> = (props) => {
  const depth = useDepth() || (() => 0);

  const color = createMemo(() => props.color || 'primary');

  return (<>
    {props.disabled
      ? <button
        class={props.class}
        type='button'
        style={props.style}
        classList={{
          'disabled': props.disabled,

          'empty': props.type === 'empty',

          'small': props.size === 'small',
          'medium': props.size === 'medium' || typeof props.size === 'undefined',
          'large': props.size === 'large',

          ...props.classList
        }}
      >{props.children}</button>
      : <Ripple
        onClick={props.onClick}
        color={props.type === 'empty'
          ? `var(--lightened-${color()})`
          : undefined}
        style={{ display: 'inline-block' }}
      >
        <button
          class={props.class}
          type='button'
          style={props.style}
          classList={{
            'primary': color() === 'primary',
            'secondary': color() === 'secondary',
            'tertiary': color() === 'tertiary',

            'disabled': props.disabled,

            'empty': props.type === 'empty',
            'gray-0': depth() === 1,
            'gray-1': depth() === 0 || depth() === 2,
            'gray-2': depth() === 3,
            'gray-3': depth() === 4,

            'small': props.size === 'small',
            'medium': props.size === 'medium' || typeof props.size === 'undefined',
            'large': props.size === 'large',

            ...props.classList
          }}
        >{props.children}</button>
      </Ripple>}
  </>);
}

export default Button;
