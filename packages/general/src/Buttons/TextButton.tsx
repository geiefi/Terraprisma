import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';

import Button from './Button';

export interface TextButtonProps {
  /**
   * @description Makes it seem as hovered but permanently.
   */
  active?: boolean;
}

const TextButton = makeComponent(
  [extendPropsFrom<TextButtonProps, typeof Button>(['active'])],
  (props, dftProps) => {
    return (
      <Button
        {...dftProps}
        unstyled
        rippleProps={{
          contrastWithBg: props.active ?? false,
          ...dftProps.rippleProps
        }}
        class={mergeClass(
          !dftProps.disabled &&
            !dftProps.unstyled && [
              'rounded-md outline-none',
              props.active
                ? 'bg-[var(--bg)] text-[var(--fg)]'
                : 'bg-transparent text-[var(--bg)] hover:bg-[var(--hover-10)]'
            ],
          dftProps.class
        )}
      >
        {dftProps.children}
      </Button>
    );
  }
);

export default TextButton;
