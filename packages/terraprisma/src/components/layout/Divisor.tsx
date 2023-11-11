import { componentBuilder, extendPropsFrom, mergeClass } from "../../utils";

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor = componentBuilder<DivisorProps>()
  .factory(extendPropsFrom<DivisorProps, 'div'>(['direction']))
  .create((props, elProps) => {
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
  });

export default Divisor;
