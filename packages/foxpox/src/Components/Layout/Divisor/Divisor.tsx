import type { Component, JSX } from "solid-js";

import './Divisor.scss';

export type DivisorProps = {
  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean | undefined>
};

const Divisor: Component<DivisorProps> = (props) => {
  return <div 
    class={`divisor ${props.class || ''}`} 
    classList={props.classList}
    style={props.style}
  ></div>;
};

export default Divisor;
