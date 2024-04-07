import { ComponentProps, JSX, splitProps } from 'solid-js';

import { Accents } from '../../..';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';
import Ripple from '../Ripple';

export type ButtonProps = LeftIntersection<
  {
    size?: 'small' | 'medium' | 'large';

    disabled?: boolean;

    rippleProps?: Omit<ComponentProps<typeof Ripple>, 'children'>;

    style?: JSX.CSSProperties;

    color?: Accents;

    /**
     * @description Removes the styling that is used to make the button fille so that it is easy to customize.
     * For example, this is used internally to style the button variants.
     *
     * @default false
     */
    unstyled?: boolean;
  },
  ComponentProps<'button'>
>;

const Button = (allProps: ButtonProps) => {
  const [props, elProps] = splitProps(allProps, [
    'color',
    'size',
    'rippleProps',
    'disabled',
    'style',
    'unstyled',
    'children'
  ]);
  const color = () => props.color ?? 'accent';
  const size = () => props.size ?? 'medium';

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
          'inline-flex gap-1 text-center items-center justify-center border-none h-min w-fit box-border select-none align-middle ease-in transition-colors !duration-150',
          !props.disabled &&
          !props.unstyled &&
          'outline-none bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--hover)]',
          props.disabled && '!bg-[var(--muted-bg)] opacity-30',
          size() === 'small' && 'px-5 py-2 text-base rounded-lg',
          size() === 'medium' && 'px-3.5 py-2 text-base rounded-lg ',
          size() === 'large' && 'px-3 py-2 text-base rounded-lg',
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
};

export default Button;