import { ComponentProps, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../utils';

export interface BoxProps extends ParentProps, ComponentProps<'div'> { }

/**
 * @description A component used for having a kind of box.
 * It uses the `floating.bg` and `floating.fg` for its *background* and *text* color respectively.
 */
const Box = (allProps: BoxProps) => {
  const [props, elProps] = splitProps(allProps, ['children']);
  return (
    <div
      {...elProps}
      class={mergeClass(
        'px-4 py-4 rounded-2xl box-border w-full border border-solid bg-[var(--floating-bg)] border-[var(--floating-border)] text-[var(--floating-fg)]',
        elProps.class
      )}
      style={elProps.style}
    >
      {props.children}
    </div>
  );
};

export default Box;
