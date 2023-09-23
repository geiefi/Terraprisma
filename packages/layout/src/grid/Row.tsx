import { JSX, ParentProps } from 'solid-js';
import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';

export interface RowProps extends ParentProps {
  gap?: string;
  rowGap?: string;

  style?: JSX.CSSProperties;
}

const Row = makeComponent(
  [extendPropsFrom<RowProps, 'div'>(['gap', 'rowGap', 'children', 'style'])],
  (props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass('flex w-100 flex-wrap', elProps.class)}
        classList={elProps.classList}
        style={{
          '--gap': props.gap,
          '--row-gap': props.rowGap,
          ...props.style
        }}
      >
        {props.children}
      </div>
    );
  }
);

export default Row;
