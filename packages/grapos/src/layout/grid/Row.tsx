import { JSX, ParentProps } from 'solid-js';
import { createComponentExtendingFromOther, mergeClass } from '../../utils';

import './Row.scss';

export interface RowProps extends ParentProps {
  gap?: string;
  rowGap?: string;

  style?: JSX.CSSProperties;
}

const Row = createComponentExtendingFromOther<RowProps, 'div'>(
  (props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass('row', elProps.class)}
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
  },
  ['gap', 'rowGap', 'children', 'style']
);

export default Row;
