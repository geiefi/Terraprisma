import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  on,
  Show,
  splitProps
} from 'solid-js';
import { isServer, Portal } from 'solid-js/web';
import { createStore, produce } from 'solid-js/store';

import { Refs } from '@solid-primitives/refs';

import './Ripple.css';
import { Accents } from '../..';
import { getAbsoluteBoundingRect, mergeClass } from '../../utils';
import { createEventListener } from '@solid-primitives/event-listener';
import { LeftIntersection } from '../../types/LeftIntersection';

export type RippleProps = LeftIntersection<
  {
    /**
     * Disabled the ripple effect but still propagates clicks through
     */
    noRipple?: boolean;
    center?: boolean;
    color?: Accents;
    /**
     * @default false
     */
    contrastWithBg?: boolean;
    wrapperProps?: Omit<ComponentProps<'div'>, 'style' | 'children'> & {
      style?: JSX.CSSProperties;
    };
    children: JSX.Element;
  },
  ComponentProps<'div'>
>;

interface RippleConfig {
  diameter: number;
  left: number;
  top: number;
}

const Ripple = (allProps: RippleProps) => {
  const [props, elProps] = splitProps(allProps, [
    'noRipple',
    'center',
    'color',
    'contrastWithBg',
    'wrapperProps',
    'children'
  ]);
  const color = () => props.color ?? 'accent';
  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  const [childrenRefs, setChildrenRefs] = createSignal<Element[]>([]);

  const rippledElementRef = createMemo(() => {
    if (isServer) return;

    const firstElementChild = childrenRefs().find(
      (c) => c instanceof HTMLElement
    );

    if (typeof firstElementChild !== 'undefined') {
      const rippledElement = firstElementChild as HTMLElement;

      return rippledElement;
    } else {
      console.warn(
        'At least one of the children of Ripple should be an actual HTML element so that the ripple can be positioned based on it!'
      );
    }
  });
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
  const [rippledElementBoundingBox, setRippledElementBoundingBox] =
    createSignal<DOMRect | undefined>();
  const updateRipplesPosition = () =>
    setRippledElementBoundingBox(getAbsoluteBoundingRect(rippledElementRef()!));

  createEffect(() => {});

  createEventListener(rippledElementRef, 'click', (event: MouseEvent) => {
    updateRipplesPosition();
    createRipple(rippleContainer()!, event.x, event.y);
  });

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
        if (ripples.length > 0 && isUpdatingRippleWrapper === false) {
          keepUpdatingRippleWrapper();
        }
      }
    )
  );

  const borderRadius = createMemo<string | undefined>(
    on(rippledElementBoundingBox, () => {
      const el = rippledElementRef();
      if (el) {
        return getComputedStyle(el).borderRadius;
      }
    })
  );

  return (
    <>
      <Portal>
        <Show when={typeof rippledElementRef() !== 'undefined'}>
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
                'relative overflow-hidden w-full h-full rounded-[inherit] p-0 m-0',
                elProps.class
              )}
              ref={(ref) => {
                setRippleContainer(ref);
              }}
            >
              <For each={ripples}>
                {(ripple) => (
                  <span
                    class="absolute animate-[ripple_0.6s_linear] rounded-full z-[999] scale-0 opacity-10 bg-[var(--bg)]"
                    style={{
                      width: `${ripple.diameter}px`,
                      height: `${ripple.diameter}px`,
                      left: `${ripple.left}px`,
                      top: `${ripple.top}px`,
                      '--bg':
                        props.contrastWithBg ?? false
                          ? `var(--${color()}-fg)`
                          : `var(--${color()}-bg)`
                    }}
                  />
                )}
              </For>
            </div>
          </div>
        </Show>
      </Portal>

      <Refs ref={(refs) => setChildrenRefs(refs)}>{props.children}</Refs>
    </>
  );
};

export default Ripple;
