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
          'tp-inline-flex tp-gap-1 tp-text-center tp-items-center tp-justify-center tp-border-none tp-h-min tp-w-fit tp-box-border tp-shadow-none tp-select-none tp-align-middle tp-ease-in tp-transition-colors !tp-duration-150',
          !props.disabled &&
          !props.unstyled &&
          'tp-rounded-md tp-outline-none tp-bg-[var(--bg)] tp-text-[var(--fg)] hover:tp-bg-[var(--hover)]',
          props.disabled && '!tp-bg-[var(--muted-bg)] tp-opacity-30',
          size() === 'small' && 'tp-px-2 tp-py-1 tp-text-sm',
          size() === 'medium' && 'tp-px-3 tp-py-2 tp-text-base',
          size() === 'large' && 'tp-px-4 tp-py-3 tp-text-lg',
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
