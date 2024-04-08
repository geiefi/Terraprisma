import { ComponentProps, splitProps } from 'solid-js';

import TextButton from './TextButton';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type IconButtonProps = LeftIntersection<
  {
    /**
     * @default
     */
    squarish?: boolean;
  },
  ComponentProps<typeof TextButton>
>;

const IconButton = (allProps: IconButtonProps) => {
  const [props, defaultButtonProps] = splitProps(allProps, [
    'squarish',
    'children'
  ]);
  return (
    <TextButton
      {...defaultButtonProps}
      rippleProps={{
        center: true,
        contrastWithBg: true,
        ...defaultButtonProps.rippleProps
      }}
      unstyled
      class={mergeClass(
        '!p-0',
        !defaultButtonProps.unstyled && [
          'aspect-square outline-none',
          (!defaultButtonProps.active || defaultButtonProps.disabled) &&
          'bg-transparent text-[var(--bg)]',
          !defaultButtonProps.disabled && [
            'hover:bg-[var(--bg)] hover:text-[var(--fg)]',
            defaultButtonProps.active && 'bg-[var(--bg)] text-[var(--fg)]'
          ],
          props.squarish ? 'rounded-lg' : 'rounded-full'
        ],
        defaultButtonProps.size === 'small' && 'w-5 h-5',
        (defaultButtonProps.size === 'medium' ||
          typeof defaultButtonProps.size === 'undefined') &&
        'w-6 h-6',
        defaultButtonProps.size === 'large' && 'w-7 h-7',
        defaultButtonProps.class
      )}
    >
      {props.children}
    </TextButton>
  );
};

export default IconButton;
  