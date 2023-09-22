import { ParentProps } from 'solid-js';
import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

export interface BoxProps extends ParentProps {}

/**
 * @description A component used for having a kind of box.
 * It uses the `floating.bg` and `floating.fg` for its *background* and *text* color respectively.
 */
const Box = makeComponent(
  [extendPropsFrom<BoxProps, 'div'>(['children'])],
  (props, elProps) => (
    <div
      {...elProps}
      class={mergeClass(
        'px-4 py-5 my-3 rounded box-border w-full border-4 border-solid bg-[var(--floating-bg)] border-[var(--floating-border)] text-[var(--floating-fg)]',
        elProps.class
      )}
      style={elProps.style}
    >
      {props.children}
    </div>
  )
);

export default Box;
