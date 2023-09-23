import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor = makeComponent(
  [extendPropsFrom<DivisorProps, 'div'>(['direction'])],
  (props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass(
          'h-[1px] my-2 opacity-40 bg-[var(--floating-bg)]',
          props.direction === 'vertical' && 'w-[1px] h-full my-0 mx-2',
          elProps.class
        )}
      />
    );
  }
);

export default Divisor;
