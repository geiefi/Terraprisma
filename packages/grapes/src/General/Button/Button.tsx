import { Component, createMemo, JSX, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';
import { useDepth } from '../Box/Box';
import Ripple from '../Ripple/Ripple';

import './Button.scss';

export interface ButtonProps extends ParentProps, JSX.HTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'tertiary' | 'transparent',
  size?: 'small' | 'medium' | 'large',

  disabled?: boolean,

  rippleColor?: string,
  rippleClass?: string,

  style?: JSX.CSSProperties,
}

const Button = (allProps: ButtonProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    ['color', 'size', 'disabled', 'rippleColor', 'rippleClass', 'onClick']
  );

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
    noRipple={props.disabled}
    onClick={(event) => {
      if (props.onClick && typeof props.onClick === 'function' && !props.disabled) {
        props.onClick(event as any);
      }
    }}
    class={props.rippleClass}
    classList={{
      'small': props.size === 'small',
      'medium': props.size === 'medium' || typeof props.size === 'undefined',
      'large': props.size === 'large',
    }}
    color={rippleColor()}
    style={{ 
      display: 'inline-block',
      'border-radius': elProps.style?.['border-radius']
    }}
  >
    <button
      type="button"
      {...elProps}
      class={elProps.class}
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

        ...elProps.classList,
      }}
    >{elProps.children}</button>
  </Ripple>;
}

const RoundedButton: Component<ButtonProps> = (props) => {
  return <Button
    rippleClass="rounded"
    color="transparent"
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
  >{props.children}</RoundedButton>;
};

Button.Rounded = RoundedButton;
Button.Icon = IconButton;
Button.Empty = EmptyButton;

export default Button;
