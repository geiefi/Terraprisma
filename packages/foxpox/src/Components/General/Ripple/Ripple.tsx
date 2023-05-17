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

  const createRipple = (element: HTMLElement, positionX: number, positionY: number) => {
    if (props.noRipple === true) return;

    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rippleConfig: RippleConfig = {
      diameter,
      left: positionX - (element.offsetLeft + radius),
      top: positionY - (element.offsetTop + radius)
    };

    setRipples(produce(ripples => {
      ripples.unshift(rippleConfig);

      setTimeout(() => {
        ripples.splice(-1, 1);
      }, 2000);
    }));
  };

  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  return <div
    class='ripple-container'
    ref={setRippleContainer}
    style={props.style}
    classList={props.classList}
    onClick={(event) => {
      createRipple(rippleContainer()!, event.clientX, event.clientY);
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
            ...(props.color ? { backgroundColor: props.color } : {})
          }}
        ></span>
      )}
    </For>

    {props.children}
  </div>;
}

export default Ripple;
