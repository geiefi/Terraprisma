import type { Component, JSX, ParentProps } from "solid-js";

import './Stack.scss';

export type StackProps = {
  spacing?: number;
  align?: 'center' | 'start' | 'end' | 'space-between' 
    | 'space-around' | 'space-evenly';
  direction?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  style?: JSX.CSSProperties;
};

const Stack: Component<ParentProps<StackProps>> = (props) => {
  return <div 
    class='stack'
    style={{ gap: `${props.spacing}px`, "justify-content": props.align, ...props.style }}
    classList={{
      'full-width': props.fullWidth,
      'horizontal': props.direction === 'horizontal' 
        || typeof props.direction === 'undefined',
      'vertical': props.direction === 'vertical'
    }}
  >
    {props.children}
  </div>;
};

export default Stack;
