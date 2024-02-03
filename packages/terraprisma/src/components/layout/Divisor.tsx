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
        'tp-h-[1px] tp-my-2 tp-opacity-40 tp-bg-[var(--floating-border)]',
        props.direction === 'vertical' && 'tp-w-[1px] tp-h-full tp-my-0 tp-mx-2',
        elProps.class
      )}
    />
  );
};

export default Divisor;
