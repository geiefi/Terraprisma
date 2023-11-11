import { ParentProps } from 'solid-js';
import { componentBuilder, extendPropsFrom, mergeClass } from '../../utils';

export interface BoxProps extends ParentProps {}

/**
 * @description A component used for having a kind of box.
 * It uses the `floating.bg` and `floating.fg` for its *background* and *text* color respectively.
 */
const Box = componentBuilder<BoxProps>()
  .factory(extendPropsFrom<BoxProps, 'div'>(['children']))
  .create((props, elProps) => (
    <div
      {...elProps}
      class={mergeClass(
        'px-4 py-5 rounded-lg box-border w-full border border-solid bg-[var(--floating-bg)] border-[var(--floating-border)] text-[var(--floating-fg)]',
        elProps.class
      )}
      style={elProps.style}
    >
      {props.children}
    </div>
  ));

export default Box;
