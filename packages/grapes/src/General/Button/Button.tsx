import { Component, createMemo, JSX, ParentProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";
import { useDepth } from "../Box/Box";
import Ripple from "../Ripple/Ripple";

import './Button.scss';

export type ButtonProps = ParentProps<{
  color?: 'primary' | 'secondary' | 'tertiary' | 'transparent',
  size?: 'small' | 'medium' | 'large',

  disabled?: boolean,

  ref?: (el: HTMLButtonElement) => any,
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
  const rippleColor = createMemo(
    () => props.rippleColor || (
      color() === 'transparent'
        ? 'var(--text-0)'
        : `var(--text-${color()})`
    )
  );

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
    color={rippleColor()}
    class={props.rippleClass}
    style={{ display: 'inline-block' }}
  >
    <button
      class={props.class}
      type='button'
      ref={props.ref}
      style={props.style}
      classList={{
        'primary': color() === 'primary',
        'secondary': color() === 'secondary',
        'tertiary': color() === 'tertiary',
        'transparent': color() === 'transparent',

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
  return <Button
    rippleClass='rounded'
    color='transparent'
    {...props}
    class={mergeClass('rounded', props.class)}
  >
    {props.children}
  </Button>;
};

const EmptyButton: Component<ButtonProps> = (props) => {
  const color = createMemo(() => props.color || 'primary');

  return <Button
    rippleColor={color() === 'transparent'
      ? undefined
      : `var(--${color()})`}
    {...props}
    class={mergeClass('empty', props.class)}
  >
    {props.children}
  </Button>;
};

const IconButton: Component<ButtonProps> = (props) => {
  return <RoundedButton 
    {...props}
    class={mergeClass('icon', props.class)}
  ></RoundedButton>;
};

Button.Rounded = RoundedButton;
Button.Icon = IconButton;
Button.Empty = EmptyButton;

export default Button;
