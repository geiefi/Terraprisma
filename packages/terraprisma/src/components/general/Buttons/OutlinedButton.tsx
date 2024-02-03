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
            'tp-rounded-md tp-outline tp-outline-2 tp-outline-offset-[-2px] tp-outline-[var(--bg)] hover:tp-bg-[var(--bg)] hover:tp-text-[var(--fg)]',
            props.active
              ? 'tp-bg-[var(--bg)] tp-text-[var(--fg)]'
              : 'tp-bg-transparent tp-text-[var(--bg)]'
          ],
        dftProps.class
      )}
    >
      {dftProps.children}
    </Button>
  );
};

export default OutlinedButton;
