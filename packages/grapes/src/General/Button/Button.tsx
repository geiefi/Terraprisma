import { Component, createMemo, JSX, ParentProps } from "solid-js";
import { useDepth } from "../Box/Box";
import Ripple from "../Ripple/Ripple";

import './Button.scss';

export type ButtonProps = ParentProps<{
  color?: 'primary' | 'secondary' | 'tertiary',
  size?: 'small' | 'medium' | 'large',

  disabled?: boolean,

  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean | undefined>,

  rippleColor?: string,
  rippleClass?: string,

  onClick?: (event: MouseEvent) => any,
}>;

const Button = (props: ButtonProps) => {
  const depth = useDepth() || (() => 0);

  const color = createMemo(() => props.color || 'primary');

  return <Ripple
    onClick={(event) => {
      if (props.onClick && !props.disabled) {
        props.onClick(event);
      }
    }}
    noRipple={props.disabled}
    classList={{
      'small': props.size === 'small',
      'medium': props.size === 'medium' || typeof props.size === 'undefined',
      'large': props.size === 'large',
    }}
    color={props.rippleColor || `var(--text-${color()})`}
    class={props.rippleClass}
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

        'gray-1': depth() === 0,
        'gray-2': depth() === 1,
        'gray-3': depth() === 2,
        'gray-4': depth() === 3,

        'small': props.size === 'small',
        'medium': props.size === 'medium' || typeof props.size === 'undefined',
        'large': props.size === 'large',

        ...props.classList
      }}
    >{props.children}</button>
  </Ripple>;
}

const RoundedButton: Component<ButtonProps> = (props) => {
  const color = createMemo(() => props.color || 'primary');

  return <Button
    class="rounded"
    rippleClass='rounded'
    rippleColor={`var(--text-${color()})`}
    {...props}
  >
    {props.children}
  </Button>;
};

const IconButton: Component<ButtonProps> = (props) => {
  return <Button
    class="icon"
    rippleClass='icon'
    rippleColor='var(--text-0)'
    {...props}
  >
    {props.children}
  </Button>;
};

const EmptyButton: Component<ButtonProps> = (props) => {
  const color = createMemo(() => props.color || 'primary');

  return <Button
    class='empty'
    rippleColor={`var(--lightened-${color()})`}
    {...props}
  >
    {props.children}
  </Button>;
};

Button.Rounded = RoundedButton;
Button.Empty = EmptyButton;
Button.Icon = IconButton;
export default Button;
