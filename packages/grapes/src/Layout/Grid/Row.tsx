import { Component, JSX, ParentProps, splitProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

import './Row.scss';

export interface RowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  rowGap?: string;

  style?: JSX.CSSProperties;
};

const Row: Component<RowProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['gap', 'rowGap']);

  return <div 
    {...elProps}
    class={mergeClass('row', elProps.class)}
    classList={elProps.classList}
    style={{ 
      gap: props.gap, 
      'row-gap': props.rowGap,
      ...elProps.style
    }}
  >
    {elProps.children}
  </div>;
};

export default Row;
