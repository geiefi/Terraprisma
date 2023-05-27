import { Component, JSX, ParentProps, splitProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

import './Stack.scss';

export interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  spacing?: number;
  align?: 'center' | 'start' | 'end' | 'space-between'
  | 'space-around' | 'space-evenly';
  direction?: 'horizontal' | 'vertical';
  fullWidth?: boolean;

  style?: JSX.CSSProperties;
}

const Stack: Component<ParentProps<StackProps>> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['spacing', 'align', 'direction', 'fullWidth']);

  return <div
    {...elProps}
    class={mergeClass('stack', elProps.class)}
    classList={{
      'full-width': props.fullWidth,
      'horizontal': props.direction === 'horizontal'
        || typeof props.direction === 'undefined',
      'vertical': props.direction === 'vertical',
      ...elProps.classList
    }}
    style={{
      gap: `${props.spacing}px`,
      "justify-content": props.align,
      ...elProps.style
    }}
  >
    {elProps.children}
  </div>;
};

export default Stack;
