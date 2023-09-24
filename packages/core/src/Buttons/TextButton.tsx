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
        class={mergeClass(
          !dftProps.disabled &&
            !dftProps.unstyled &&
            'rounded-sm border-none hover:bg-[var(--bg)] hover:text-[var(--fg)]',
          !dftProps.disabled &&
            !dftProps.unstyled &&
            !props.active &&
            'bg-transparent text-[var(--bg)]',
          !dftProps.disabled &&
            !dftProps.unstyled &&
            props.active &&
            'bg-[var(--bg)] text-[var(--fg)]',
          dftProps.class
        )}
      >
        {dftProps.children}
      </Button>
    );
  }
);

export default TextButton;
