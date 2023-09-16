import { ComponentProps, createMemo, JSX } from 'solid-js';

import { makeComponent, extendPropsFrom } from '@terraprisma/utils';

import Ripple from '../Ripple/Ripple';

import { addAccentColoring } from '../factories';

import './Button.scss';
import { Accents } from '..';

export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  /**
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

  disabled?: boolean;

  rippleColor?: ComponentProps<typeof Ripple>['color'];
  rippleClass?: string;
  centerRipple?: boolean;

  style?: JSX.CSSProperties;
}

const Button = makeComponent(
  [
    addAccentColoring<ButtonProps>(),
    extendPropsFrom<ButtonProps & { color?: Accents }, 'button'>([
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
    const buttonHoverColor = createMemo(() => `var(--${color()}-hover)`);

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
        color={props.rippleColor}
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
            '--fg': buttonFgColor(),
            '--hover': buttonHoverColor()
          }}
          classList={{
            disabled: props.disabled,

            filled:
              props.variant === 'filled' ||
              typeof props.variant === 'undefined',
            outlined: props.variant === 'outlined',

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
