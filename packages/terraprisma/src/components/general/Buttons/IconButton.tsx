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
        '!tp-p-0',
        !defaultButtonProps.unstyled && [
          'tp-aspect-square tp-outline-none',
          (!defaultButtonProps.active || defaultButtonProps.disabled) &&
          'tp-bg-transparent tp-text-[var(--bg)]',
          !defaultButtonProps.disabled && [
            'hover:tp-bg-[var(--bg)] hover:tp-text-[var(--fg)]',
            defaultButtonProps.active && 'tp-bg-[var(--bg)] tp-text-[var(--fg)]'
          ],
          props.squarish ? 'tp-rounded-lg' : 'tp-rounded-full'
        ],
        defaultButtonProps.size === 'small' && 'tp-min-w-[2rem] tp-min-h-[2rem]',
        (defaultButtonProps.size === 'medium' ||
          typeof defaultButtonProps.size === 'undefined') &&
        'tp-min-w-[3rem] tp-min-h-[3rem]',
        defaultButtonProps.size === 'large' && 'tp-min-w-[3.5rem] tp-min-h-[3.5rem]',
        defaultButtonProps.class
      )}
    >
      {props.children}
    </TextButton>
  );
};

export default IconButton;
