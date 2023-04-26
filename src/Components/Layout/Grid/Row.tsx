import type { Component, ParentProps } from "solid-js";

import './Row.scss';

export type RowProps = ParentProps<{
  gap?: string;
  rowGap?: string;
}>;

const Row: Component<RowProps> = (props) => {
  return <div class='row' style={{ gap: props.gap, 'row-gap': props.rowGap }}>
    {props.children}
  </div>;
};

export default Row;
