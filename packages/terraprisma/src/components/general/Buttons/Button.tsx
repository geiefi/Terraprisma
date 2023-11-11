import { ComponentProps, createMemo, JSX, ParentProps } from 'solid-js';

import Ripple from '../Ripple';
import { Accents } from '../../..';
import { componentBuilder, addAccentColoring, extendPropsFrom, mergeClass } from '../../../utils';

export interface ButtonProps extends ParentProps {
  size?: 'small' | 'medium' | 'large';

  disabled?: boolean;

  rippleProps?: Omit<ComponentProps<typeof Ripple>, 'children'>;

  style?: JSX.CSSProperties;

  /**
   * @description Removes the styling that is used to make the button fille so that it is easy to customize.
   * For example, this is used internally to style the button variants.
   *
   * @default false
   */
  unstyled?: boolean;
}

const Button = componentBuilder<ButtonProps>()
  .factory(addAccentColoring<ButtonProps>())
  .factory(
    extendPropsFrom<ButtonProps & { color?: Accents }, 'button'>([
      'color',
      'size',
      'disabled',
      'rippleProps',
      'style',
      'unstyled',
      'children'
    ])
  )
  .create((props, color, elProps) => {
    const size = createMemo(() => props.size ?? 'medium');

    return (
      <Ripple
        noRipple={props.disabled}
        contrastWithBg
        color={color()}
        {...props.rippleProps}
      >
        <button
          type="button"
          {...elProps}
          class={mergeClass(
            'inline-flex gap-1 text-center items-center justify-center border-none h-min w-fit box-border shadow-none select-none align-middle ease-in transition-colors !duration-150',
            !props.disabled &&
              !props.unstyled &&
              'rounded-md outline-none bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--hover)]',
            props.disabled && '!bg-[var(--muted-bg)] opacity-30',
            size() === 'small' && 'px-2 py-1 text-sm',
            size() === 'medium' && 'px-3 py-2 text-base',
            size() === 'large' && 'px-4 py-3 text-lg',
            elProps.class
          )}
          style={{
            '--bg': `var(--${color()}-bg)`,
            '--fg': `var(--${color()}-fg)`,
            '--hover': `var(--${color()}-hover)`,
            '--hover-10': `var(--${color()}-hover-10)`,
            ...props.style
          }}
          aria-disabled={props.disabled}
        >
          {props.children}
        </button>
      </Ripple>
    );
  });

export default Button;
