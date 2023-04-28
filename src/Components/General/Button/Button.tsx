import { Component, createMemo, JSX } from "solid-js";
import { useDepth } from "../Box/Box";
import Ripple from "../Ripple/Ripple";

import './Button.scss';

export type ButtonProps = {
  onClick?: (event: MouseEvent) => any,
  class?: string,
  classList?: Record<string, boolean>,
  size?: 'small' | 'medium' | 'large',
  type?: 'default' | 'empty',
  children: JSX.Element
};

const Button: Component<ButtonProps> = (props) => {
  const depth = useDepth() || (() => 0);
  const backgroundColor = createMemo(() => {
    if (props.type === 'empty') {
      switch (depth()) {
        case 0:
          return 'var(--gray-1)';
        case 1:
          return 'var(--gray-0)';
        case 2:
          return 'var(--gray-1)';
        case 3:
          return 'var(--gray-2)';
        case 4:
          return 'var(--gray-3)';
      }
    } else if (props.type === 'default' || typeof props.type === 'undefined') {
      return 'var(--primary-accent)';
    }
  });

  return <Ripple onClick={props.onClick} style={{ display: 'inline-block' }}>
    <button 
      class={props.class} 
      classList={{
        'empty': props.type === 'empty',
        'small': props.size === 'small',
        'medium': props.size === 'medium' || typeof props.size === 'undefined',
        'large': props.size === 'large'
      }}
      style={{
        '--bg-color': backgroundColor()
      }}
    >{props.children}</button>
  </Ripple>;
}

export default Button;
