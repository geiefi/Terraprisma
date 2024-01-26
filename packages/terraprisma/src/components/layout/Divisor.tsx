import { ComponentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../utils';
import { LeftIntersection } from '../../types/LeftIntersection';

export type DivisorProps = LeftIntersection<
  {
    direction?: 'vertical' | 'horizontal';
  },
  Omit<ComponentProps<'div'>, 'children'>
>;

const Divisor = (allProps: DivisorProps) => {
  const [props, elProps] = splitProps(allProps, ['direction']);
  return (
    <div
      {...elProps}
      class={mergeClass(
        'h-[1px] my-2 opacity-40 bg-[var(--floating-border)]',
        props.direction === 'vertical' && 'w-[1px] h-full my-0 mx-2',
        elProps.class
      )}
    />
  );
};

export default Divisor;
