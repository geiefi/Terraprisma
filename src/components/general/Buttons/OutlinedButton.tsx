import { ComponentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import Button from './Button';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type OutlinedButtonProps = LeftIntersection<{
  /**
   * @description Makes it seem as hovered but permanently.
   */
  active?: boolean;
}, ComponentProps<typeof Button>>;

const OutlinedButton = (allProps: OutlinedButtonProps) => {
  const [props, dftProps] = splitProps(allProps, ['active']);
  return (
    <Button
      {...dftProps}
      unstyled
      class={mergeClass(
        !dftProps.disabled &&
          !dftProps.unstyled && [
            'outline outline-1 outline-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
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
};

export default OutlinedButton;
