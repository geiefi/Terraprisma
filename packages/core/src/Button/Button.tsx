import { ComponentProps, createMemo, JSX } from 'solid-js';

import { makeComponent, extendPropsFrom } from '@terraprisma/utils';

import Ripple from '../Ripple/Ripple';

import { PossibleColors } from '../themes';
import { addColors } from '../factories';

import './Button.scss';

export interface ButtonProps {
  color?: PossibleColors | 'transparent';
  size?: 'small' | 'medium' | 'large';

  disabled?: boolean;

  rippleColor?: ComponentProps<typeof Ripple>['color'];
  rippleClass?: string;
  centerRipple?: boolean;

  style?: JSX.CSSProperties;
}

const Button = makeComponent(
  [
    addColors<ButtonProps>(),
    extendPropsFrom<
      ButtonProps & { color?: PossibleColors<Themes[number]> },
      'button'
    >([
      'color',
      'size',
      'disabled',
      'rippleColor',
      'rippleClass',
      'centerRipple'
    ])
  ],
  (props, color, elProps) => {
    const buttonBgColor = createMemo(() => `var(--${color()}-bg)`);
    const buttonFgColor = createMemo(() => `var(--${color()}-fg)`);
    const rippleColor = createMemo(() => props.rippleColor);

    return (
      <Ripple
        noRipple={props.disabled}
        center={props.centerRipple}
        class={props.rippleClass}
        classList={{
          small: props.size === 'small',
          medium: props.size === 'medium' || typeof props.size === 'undefined',
          large: props.size === 'large'
        }}
        color={rippleColor()}
        style={{
          display: 'inline-block',
          'border-radius': props.style?.['border-radius']
        }}
      >
        <button
          type="button"
          {...elProps}
          class={elProps.class}
          style={{
            '--bg': buttonBgColor(),
            '--fg': buttonFgColor()
          }}
          classList={{
            disabled: props.disabled,

            small: props.size === 'small',
            medium:
              props.size === 'medium' || typeof props.size === 'undefined',
            large: props.size === 'large',

            ...elProps.classList
          }}
        >
          {elProps.children}
        </button>
      </Ripple>
    );
  }
);

export default Button;
