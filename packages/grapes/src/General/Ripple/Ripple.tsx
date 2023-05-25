import { Component, createSignal, For, JSX, ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";

import './Ripple.scss';

export type RippleProps = ParentProps<{
  onClick?: (event: MouseEvent) => any,
  /**
   * Disabled the ripple effect but still propagates clicks through
   */
  noRipple?: boolean,
  classList?: Record<string, boolean | undefined>,
  class?: string,
  color?: string,
  style?: JSX.CSSProperties
}>;

interface RippleConfig {
  diameter: number;
  left: number;
  top: number;
}

const Ripple: Component<RippleProps> = (props) => {
  const [ripples, setRipples] = createStore<RippleConfig[]>([]);

  const createRipple = (element: HTMLElement, globalPositionX: number, globalPositionY: number) => {
    if (props.noRipple === true) return;
    console.log(element.offsetParent);

    const positionX = globalPositionX - element.getBoundingClientRect().x;
    const positionY = globalPositionY - element.getBoundingClientRect().y;

    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rippleConfig: RippleConfig = {
      diameter,
      left: positionX - radius,
      top: positionY - radius
    };

    console.log(rippleConfig);

    setRipples(produce(ripples => {
      ripples.unshift(rippleConfig);

      setTimeout(() => {
        ripples.splice(-1, 1);
      }, 2000);
    }));
  };

  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  return <div
    class={'ripple-container ' + (props.class || '')}
    ref={setRippleContainer}
    style={props.style}
    classList={props.classList}
    onClick={(event) => {
      createRipple(rippleContainer()!, event.x, event.y);
      if (typeof props.onClick !== 'undefined') {
        props.onClick(event);
      }
    }}
  >
    <For each={ripples}>
      {(ripple) => (
        ripple && <span
          class='ripple'
          style={{
            width: `${ripple.diameter}px`,
            height: `${ripple.diameter}px`,
            left: `${ripple.left}px`,
            top: `${ripple.top}px`,
            ...(props.color ? { 'background-color': props.color } : {})
          }}
        ></span>
      )}
    </For>

    {props.children}
  </div>;
}

export default Ripple;
