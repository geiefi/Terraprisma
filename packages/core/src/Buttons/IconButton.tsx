import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';
import { ParentProps } from 'solid-js';

import TextButton from './TextButton';

export interface IconButtonProps extends ParentProps {
  /**
   * @default
   */
  squarish?: boolean;
}

const IconButton = makeComponent(
  [
    extendPropsFrom<IconButtonProps, typeof TextButton>([
      'squarish',
      'children'
    ])
  ],
  (props, dftProps) => (
    <TextButton
      {...dftProps}
      rippleProps={{
        center: true,
        ...dftProps.rippleProps
      }}
      unstyled
      class={mergeClass(
        '!p-0',
        !dftProps.disabled &&
          !dftProps.unstyled &&
          'border-none aspect-square hover:bg-[var(--bg)] hover:text-[var(--fg)]',
        !dftProps.disabled &&
          !dftProps.unstyled &&
          !props.squarish &&
          'rounded-full',
        !dftProps.disabled &&
          !dftProps.unstyled &&
          props.squarish &&
          'rounded-lg',
        !dftProps.disabled &&
          !dftProps.unstyled &&
          !dftProps.active &&
          'bg-transparent text-[var(--bg)]',
        !dftProps.disabled &&
          !dftProps.unstyled &&
          dftProps.active &&
          'bg-[var(--bg)] text-[var(--fg)]',
        dftProps.size === 'small' && 'min-w-[2rem] min-h-[2rem]',
        (dftProps.size === 'medium' || typeof dftProps.size === 'undefined') &&
          'min-w-[3rem] min-h-[3rem]',
        dftProps.size === 'large' && 'min-w-[3.5rem] min-h-[3.5rem]',
        dftProps.class
      )}
    >
      {props.children}
    </TextButton>
  )
);

export default IconButton;
