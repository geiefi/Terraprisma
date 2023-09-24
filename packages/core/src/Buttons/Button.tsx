import { ComponentProps, createMemo, JSX } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';
import { Accents, addAccentColoring } from '@terraprisma/theming';

import Ripple from '../Ripple';

export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  /**
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

  disabled?: boolean;

  centerRipple?: boolean;
  rippleProps?: Omit<ComponentProps<typeof Ripple>, 'children'>;

  style?: JSX.CSSProperties;
}

const Button = makeComponent(
  [
    addAccentColoring<ButtonProps>(),
    extendPropsFrom<ButtonProps & { color?: Accents }, 'button'>([
      'color',
      'size',
      'variant',
      'disabled',
      'centerRipple',
      'rippleProps',
      'style'
    ])
  ],
  (props, color, elProps) => {
    const buttonBgColor = createMemo(() => `var(--${color()}-bg)`);
    const buttonFgColor = createMemo(() => `var(--${color()}-fg)`);
    const buttonHoverColor = createMemo(() => `var(--${color()}-hover)`);

    const variant = createMemo(() => props.variant ?? 'filled');
    const size = createMemo(() => props.size ?? 'medium');

    return (
      <Ripple
        noRipple={props.disabled}
        center={props.centerRipple}
        color={color()}
        {...props.rippleProps}
        class={mergeClass('rounded-sm', props.rippleProps?.class)}
      >
        <button
          type="button"
          {...elProps}
          class={mergeClass(
            'inline-flex bap-1 rounded-sm items-center h-max w-fit box-border outline-none shadow-none select-none align-middle',
            'ease-in transition-colors !duration-300',
            !props.disabled &&
              variant() === 'filled' &&
              'border-none bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--hover)]',
            !props.disabled &&
              variant() === 'outlined' &&
              'bg-transparent border-2 border-solid border-[var(--bg)] text-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
            props.disabled &&
              'bg-[var(--muted-bg)] text-[var(--muted-fg)] shadow-none',
            size() === 'small' && 'px-2 py-1 text-sm',
            size() === 'medium' && 'px-4 py-2 text-base',
            size() === 'large' && 'px-5 py-3 text-lg',
            elProps.class
          )}
          style={{
            '--bg': buttonBgColor(),
            '--fg': buttonFgColor(),
            '--hover': buttonHoverColor()
          }}
          aria-disabled={props.disabled}
        >
          {elProps.children}
        </button>
      </Ripple>
    );
  }
);

export default Button;
