import type { Component, JSX, ParentProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

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
    class={mergeClass('row', props.class)}
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
