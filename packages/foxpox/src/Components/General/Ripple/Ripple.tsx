import { Component, createSignal, JSX, ParentProps } from "solid-js";

import './Ripple.scss';

export type RippleProps = ParentProps<{
  onClick?: (event: MouseEvent) => any,
  /**
   * Disabled the ripple effect but still propagates clicks through
   */
  noRipple?: boolean,
  color?: string,
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
    if (props.noRipple === true) return;

    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${positionX - (element.offsetLeft + radius)}px`;
    circle.style.top = `${positionY - (element.offsetTop + radius)}px`;
    if (props.color) {
      circle.style.backgroundColor = props.color;
    }
    circle.classList.add("ripple"); 

    removeFirstRipple(element);

    element.appendChild(circle);
  };

  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  return <div 
    class='ripple-container' 
    ref={setRippleContainer}
    style={props.style}
    onClick={(event) => {
      if (typeof rippleContainer() !== 'undefined') {
        createRipple(rippleContainer()!, event.clientX, event.clientY);
        if (typeof props.onClick !== 'undefined') {
          props.onClick(event);
        }
      } else {
        createRipple(event.target as any, event.clientX, event.clientY);
        if (typeof props.onClick !== 'undefined') {
          props.onClick(event);
        }
      }
    }}
  >{props.children}</div>;
}

export default Ripple;
