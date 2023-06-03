import { Component, createSignal, For, JSX, ParentProps, splitProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { mergeClass } from "../../_Shared/Utils";

import './Ripple.scss';

export interface RippleProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Disabled the ripple effect but still propagates clicks through
   */
  noRipple?: boolean,
  color?: string,
}

interface RippleConfig {
  diameter: number;
  left: number;
  top: number;
}

const Ripple: Component<RippleProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    ['noRipple', 'color']
  );

  const [ripples, setRipples] = createStore<RippleConfig[]>([]);

  const createRipple = (element: HTMLElement, globalPositionX: number, globalPositionY: number) => {
    if (props.noRipple === true) return;

    const positionX = globalPositionX - element.getBoundingClientRect().x;
    const positionY = globalPositionY - element.getBoundingClientRect().y;

    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rippleConfig: RippleConfig = {
      diameter,
      left: positionX - radius,
      top: positionY - radius
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
    {...elProps}
    class={mergeClass('ripple-container', elProps.class)}
    ref={setRippleContainer}
    onClick={(event) => {
      createRipple(rippleContainer()!, event.x, event.y);
      if (typeof elProps.onClick !== 'undefined' && typeof elProps.onClick === 'function') {
        elProps.onClick(event);
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

    {elProps.children}
  </div>;
}

export default Ripple;
