import type { Component, JSX, ParentProps } from "solid-js";

import './Ripple.scss';

export type RippleProps = ParentProps<{
  onClick?: (event: MouseEvent) => any,
  style?: JSX.CSSProperties
}>;

const Ripple: Component<RippleProps> = (props) => {
  const removeFirstRipple = (element: HTMLElement) => {
    const ripple = element.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
  }

  const createRipple = (element: HTMLElement, positionX: number, positionY: number) => {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${positionX - (element.offsetLeft + radius)}px`;
    circle.style.top = `${positionY - (element.offsetTop + radius)}px`;
    circle.classList.add("ripple"); 

    removeFirstRipple(element);

    element.appendChild(circle);
  };

  return <div 
    class='ripple-container' 
    style={props.style}
    onClick={(event) => {
      createRipple(event.target.parentElement!, event.clientX, event.clientY);
      if (typeof props.onClick !== 'undefined') {
        props.onClick(event);
      }
    }}
  >{props.children}</div>;
}

export default Ripple;
