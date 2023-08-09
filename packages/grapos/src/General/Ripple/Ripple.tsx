import {
  Component,
  createSignal,
  For,
  JSX,
  ParentProps,
  Show,
  splitProps,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { mergeClass } from '../../_Shared/Utils';

import './Ripple.scss';

export interface RippleProps
  extends ParentProps,
  JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Disabled the ripple effect but still propagates clicks through
   */
  noRipple?: boolean;
  center?: boolean;
  color?: string;
}

interface RippleConfig {
  diameter: number;
  left: number;
  top: number;
}

const Ripple: Component<RippleProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, [
    'noRipple',
    'center',
    'color',
  ]);

  const [ripples, setRipples] = createStore<RippleConfig[]>([]);

  const createRipple = (
    element: HTMLElement,
    globalPositionX: number,
    globalPositionY: number
  ) => {
    if (props.noRipple === true) return;

    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const elDOMRect = element.getBoundingClientRect();
    let positionX = globalPositionX - elDOMRect.x;
    let positionY = globalPositionY - elDOMRect.y;
    if (props.center) {
      positionX = radius;
      positionY = radius;
    }

    const rippleConfig: RippleConfig = {
      diameter,
      left: positionX - radius,
      top: positionY - radius,
    };

    setRipples(
      produce((ripples) => {
        ripples.unshift(rippleConfig);

        setTimeout(() => {
          ripples.splice(-1, 1);
        }, 2000);
      })
    );
  };

  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  return (
    <div
      {...elProps}
      class={mergeClass('ripple-container', elProps.class)}
      ref={setRippleContainer}
      onClick={(event) => {
        createRipple(rippleContainer()!, event.x, event.y);
        if (
          typeof elProps.onClick !== 'undefined' &&
          typeof elProps.onClick === 'function'
        ) {
          elProps.onClick(event);
        }
      }}
    >
      <For each={ripples}>
        {(ripple) => (
          <Show when={ripple}>
            <span
              class="ripple"
              style={{
                width: `${ripple.diameter}px`,
                height: `${ripple.diameter}px`,
                left: `${ripple.left}px`,
                top: `${ripple.top}px`,
                ...(props.color ? { 'background-color': props.color } : {}),
              }}
            />
          </Show>
        )}
      </For>

      {elProps.children}
    </div>
  );
};

export default Ripple;