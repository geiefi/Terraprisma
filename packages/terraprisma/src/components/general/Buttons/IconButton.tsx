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
        defaultButtonProps.size === 'small' && 'min-w-[2rem] min-h-[2rem]',
        (defaultButtonProps.size === 'medium' ||
          typeof defaultButtonProps.size === 'undefined') &&
        'min-w-[3rem] min-h-[3rem]',
        defaultButtonProps.size === 'large' && 'min-w-[3.5rem] min-h-[3.5rem]',
        defaultButtonProps.class
      )}
    >
      {props.children}
    </TextButton>
  );
};

export default IconButton;
