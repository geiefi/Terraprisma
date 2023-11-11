import {
  extendPropsFrom,
  componentBuilder,
  mergeClass
} from 'utils';
import { ParentProps } from 'solid-js';

import TextButton from './TextButton';

export interface IconButtonProps extends ParentProps {
  /**
   * @default
   */
  squarish?: boolean;
}

const IconButton = componentBuilder<IconButtonProps>()
  .factory(
    extendPropsFrom<IconButtonProps, typeof TextButton>([
      'squarish',
      'children'
    ])
  )
  .create((props, defaultProps) => (
    <TextButton
      {...defaultProps}
      rippleProps={{
        center: true,
        contrastWithBg: true,
        ...defaultProps.rippleProps
      }}
      unstyled
      class={mergeClass(
        '!p-0',
        !defaultProps.unstyled && [
          'aspect-square outline-none',
          (!defaultProps.active || defaultProps.disabled) &&
            'bg-transparent text-[var(--bg)]',
          !defaultProps.disabled && [
            'hover:bg-[var(--bg)] hover:text-[var(--fg)]',
            defaultProps.active && 'bg-[var(--bg)] text-[var(--fg)]'
          ],
          props.squarish ? 'rounded-lg' : 'rounded-full'
        ],
        defaultProps.size === 'small' && 'min-w-[2rem] min-h-[2rem]',
        (defaultProps.size === 'medium' ||
          typeof defaultProps.size === 'undefined') &&
          'min-w-[3rem] min-h-[3rem]',
        defaultProps.size === 'large' && 'min-w-[3.5rem] min-h-[3.5rem]',
        defaultProps.class
      )}
    >
      {props.children}
    </TextButton>
  ));

export default IconButton;
