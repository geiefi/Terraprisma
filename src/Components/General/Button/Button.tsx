import type { Component, JSX } from "solid-js";
import Ripple from "../Ripple/Ripple";

import './Button.scss';

export type ButtonProps = {
  onClick?: (event: MouseEvent) => any,
  class?: string,
  classList?: Record<string, boolean>,
  size?: 'small' | 'medium' | 'large',
  children: JSX.Element
};

const Button: Component<ButtonProps> = (props) => {
  return <Ripple onClick={props.onClick} style={{ display: 'inline-block' }}>
    <button classList={{
      'small': props.size === 'small',
      'medium': props.size === 'medium' || typeof props.size === 'undefined',
      'large': props.size === 'large'
    }}>{props.children}</button>
  </Ripple>;
}

export default Button;
