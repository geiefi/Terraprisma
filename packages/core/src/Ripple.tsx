import {
  children as accessChildren,
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  on,
  onCleanup,
  Show
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { createStore, produce } from 'solid-js/store';

import {
  mergeClass,
  canUseDocument,
  makeComponent,
  extendPropsFrom
} from '@terraprisma/utils';
import { Accents, addAccentColoring } from '@terraprisma/theming';

import './Ripple.css';

export interface RippleProps {
  /**
   * Disabled the ripple effect but still propagates clicks through
   */
  noRipple?: boolean;
  center?: boolean;
  wrapperProps?: Omit<ComponentProps<'div'>, 'style' | 'children'> & {
    style?: JSX.CSSProperties;
  };
  children: JSX.Element;
}

interface RippleConfig {
  diameter: number;
  left: number;
  top: number;
}

let offsetBase: HTMLDivElement;

function absolutePosition(el: HTMLElement): DOMRect {
  let left = 0,
    top = 0,
    width = 0,
    height = 0;
  if (!offsetBase && document.body) {
    offsetBase = document.createElement('div');
    offsetBase.style.cssText = 'position:absolute;left:0;top:0';
    document.body.appendChild(offsetBase);
  }
  const boundingRect = el.getBoundingClientRect();
  const baseRect = offsetBase.getBoundingClientRect();
  left = boundingRect.left - baseRect.left;
  top = boundingRect.top - baseRect.top;
  width = boundingRect.right - boundingRect.left;
  height = boundingRect.bottom - boundingRect.top;
  return {
    left: left,
    x: left,
    top: top,
    y: top,
    width: width,
    height: height,
    right: left + width,
    bottom: top + height,
    toJSON() {
      return JSON.stringify(this);
    }
  };
}

const Ripple = makeComponent(
  [
    addAccentColoring<RippleProps>(),
    extendPropsFrom<RippleProps & { color?: Accents }, 'div'>([
      'noRipple',
      'center',
      'color',
      'wrapperProps',
      'children'
    ])
  ],
  (props, color, elProps) => {
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
        top: positionY - radius
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

    const [rippleContainer, setRippleContainer] =
      createSignal<HTMLDivElement>();

    const children = accessChildren(() => props.children);
    const childrenList = createMemo(() => {
      const childrenAccessed = children();
      return Array.isArray(childrenAccessed)
        ? childrenAccessed
        : [childrenAccessed];
    });

    const [rippledElementBoundingBox, setRippledElementBoundingBox] =
      createSignal<DOMRect | undefined>();
    const updateRipplesPosition = () =>
      setRippledElementBoundingBox(absolutePosition(rippledElement()!));

    const addNewRipple = (event: MouseEvent) => {
      updateRipplesPosition();
      createRipple(rippleContainer()!, event.x, event.y);
    };

    let isUpdatingRippleWrapper = false;
    const keepUpdatingRippleWrapper = () => {
      isUpdatingRippleWrapper = true;

      requestAnimationFrame(() => {
        if (ripples.length > 0) {
          updateRipplesPosition();
          keepUpdatingRippleWrapper();
        } else {
          isUpdatingRippleWrapper = false;
        }
      });
    };

    createEffect(
      on(
        () => ripples[0],
        () => {
          if (isUpdatingRippleWrapper === false) {
            keepUpdatingRippleWrapper();
          }
        }
      )
    );

    const rippledElement = createMemo<HTMLElement | undefined>(() => {
      if (canUseDocument()) {
        const firstElementChild = childrenList().find(
          (c) => c instanceof HTMLElement
        );

        if (typeof firstElementChild !== 'undefined') {
          const rippledElement = firstElementChild as HTMLElement;

          rippledElement.addEventListener('click', addNewRipple);

          return rippledElement;
        } else {
          console.warn(
            'At least one of the children of Ripple should be an actual HTML element so that the ripple can be positioned based on it!'
          );
        }
      }
    });

    const borderRadius = createMemo<string | undefined>(
      on(rippledElementBoundingBox, () => {
        const el = rippledElement();
        if (el) {
          return getComputedStyle(el).borderRadius;
        }
      })
    );

    onCleanup(() => {
      const el = rippledElement();
      if (el) {
        el.removeEventListener('click', addNewRipple);
      }
    });

    return (
      <>
        <Show when={rippledElement()}>
          <Portal>
            <div
              {...props.wrapperProps}
              class={mergeClass(
                'absolute cursor-none pointer-events-none',
                props.wrapperProps?.class
              )}
              style={{
                top: (rippledElementBoundingBox()?.top ?? 0) + 'px',
                left: (rippledElementBoundingBox()?.left ?? 0) + 'px',
                width: (rippledElementBoundingBox()?.width ?? 0) + 'px',
                height: (rippledElementBoundingBox()?.height ?? 0) + 'px',

                'border-radius': borderRadius(),

                ...props.wrapperProps?.style
              }}
            >
              <div
                {...elProps}
                class={mergeClass(
                  'relative overflow-hidden w-full h-full p-0 m-0',
                  elProps.class
                )}
                ref={setRippleContainer}
              >
                <For each={ripples}>
                  {(ripple) => (
                    <Show when={ripple}>
                      <span
                        class="absolute animate-[ripple_0.6s_linear] rounded-full z-[999] scale-0 opacity-20 bg-[var(--bg)]"
                        style={{
                          width: `${ripple.diameter}px`,
                          height: `${ripple.diameter}px`,
                          left: `${ripple.left}px`,
                          top: `${ripple.top}px`,
                          '--bg': `var(--${color()}-fg)`
                        }}
                      />
                    </Show>
                  )}
                </For>
              </div>
            </div>
          </Portal>
        </Show>

        {childrenList()}
      </>
    );
  }
);

export default Ripple;
