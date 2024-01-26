import { ComponentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import Button from './Button';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type TextButtonProps = LeftIntersection<
  {
    /**
     * @description Makes it seem as hovered but permanently.
     */
    active?: boolean;
  },
  ComponentProps<typeof Button>
>;

const TextButton = (allProps: TextButtonProps) => {
  const [props, dftProps] = splitProps(allProps, ['active']);
  return (
    <Button
      {...dftProps}
      unstyled
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
};

export default TextButton;
