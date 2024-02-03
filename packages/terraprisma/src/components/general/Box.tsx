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
        'tp-px-4 tp-py-5 tp-rounded-lg tp-box-border tp-w-full tp-border tp-border-solid tp-bg-[var(--floating-bg)] tp-border-[var(--floating-border)] tp-text-[var(--floating-fg)]',
        elProps.class
      )}
      style={elProps.style}
    >
      {props.children}
    </div>
  );
};

export default Box;
