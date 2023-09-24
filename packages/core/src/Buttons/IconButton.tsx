import { mergeClass } from '@terraprisma/utils';
import { ComponentProps } from 'solid-js';

import TextButton from './TextButton';

const IconButton = (props: ComponentProps<typeof TextButton>) => (
  <TextButton
    {...props}
    unstyled
    class={mergeClass(
      !props.disabled &&
        !props.unstyled &&
        'bg-transparent border-none rounded-full aspect-square text-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
      !props.disabled &&
        !props.unstyled &&
        props.active &&
        'bg-[var(--bg)] text-[var(--fg)]',
      props.class
    )}
  >
    {props.children}
  </TextButton>
);

export default IconButton;
