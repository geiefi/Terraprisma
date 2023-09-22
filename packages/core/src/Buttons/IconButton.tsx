import { ComponentProps } from 'solid-js';

import { mergeClass } from '@terraprisma/utils';

import Button from './Button';

const IconButton = (props: Omit<ComponentProps<typeof Button>, 'color'>) => {
  return (
    <Button
      {...props}
      class={mergeClass(
        'rounded-full bg-transparent hover:bg-[var(--bg)/0.2]',
        props.class
      )}
      rippleProps={{
        ...props.rippleProps,
        class: mergeClass('rounded-full', props.rippleProps?.class)
      }}
    >
      {props.children}
    </Button>
  );
};

export default IconButton;
