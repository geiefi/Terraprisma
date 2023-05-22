import type { Component, JSX, ParentProps } from "solid-js";

import './Row.scss';

export type RowProps = ParentProps<{
  gap?: string;
  rowGap?: string;

  class?: string;
  classList?: Record<string, boolean | undefined>;
  style?: JSX.CSSProperties;
}>;

const Row: Component<RowProps> = (props) => {
  return <div 
    class={'row ' + (props.class || '')}
    classList={props.classList}
    style={{ 
      gap: props.gap, 
      'row-gap': props.rowGap,
      ...props.style
    }}
  >
    {props.children}
  </div>;
};

export default Row;
