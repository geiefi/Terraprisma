import {
  extendPropsFrom,
  componentBuilder,
  mergeClass
} from 'utils';

import Button from './Button';

export interface OutlinedButtonProps {
  /**
   * @description Makes it seem as hovered but permanently.
   */
  active?: boolean;
}

const OutlinedButton = componentBuilder<OutlinedButtonProps>()
  .factory(extendPropsFrom<OutlinedButtonProps, typeof Button>(['active']))
  .create((props, dftProps) => {
    return (
      <Button
        {...dftProps}
        unstyled
        class={mergeClass(
          !dftProps.disabled &&
            !dftProps.unstyled && [
              'rounded-md outline outline-2 outline-offset-[-2px] outline-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
              props.active
                ? 'bg-[var(--bg)] text-[var(--fg)]'
                : 'bg-transparent text-[var(--bg)]'
            ],
          dftProps.class
        )}
      >
        {dftProps.children}
      </Button>
    );
  });

export default OutlinedButton;
