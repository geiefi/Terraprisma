import type { Component, JSX } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

import './Divisor.scss';

export type DivisorProps = {
  direction?: 'vertical' | 'horizontal';

  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean | undefined>
};

const Divisor: Component<DivisorProps> = (props) => {
  return <div 
    class={mergeClass('divisor', props.class)} 
    classList={{
      'vertical': props.direction === 'vertical',
      ...props.classList
    }}
    style={props.style}
  ></div>;
};

export default Divisor;
