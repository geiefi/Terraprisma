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
import { Portal } from 'solid-js/web';
import { createStore, produce } from 'solid-js/store';

import { Ref } from '@solid-primitives/refs';
import { createEventListener } from '@solid-primitives/event-listener';

import './Ripple.css';
import { Accents } from '../..';
import { getAbsoluteBoundingRect, mergeClass } from '../../utils';
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

  const [rippleContainer, setRippleContainer] = createSignal<HTMLDivElement>();

  const [rippledElement, setRippledElement] = createSignal<HTMLElement | undefined>(
    undefined
  );

  createEventListener(rippledElement, 'click', (event: MouseEvent) => {
    updateRipplesPosition();
    createRipple(rippleContainer()!, event.x, event.y);
  });

  const [rippledElementBoundingBox, setRippledElementBoundingBox] =
    createSignal<DOMRect | undefined>();
  const updateRipplesPosition = () => {
    const elementBeingRippled = rippledElement();
    if (typeof elementBeingRippled !== 'undefined') {
      setRippledElementBoundingBox(
        getAbsoluteBoundingRect(elementBeingRippled)
      );
    }
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

  const borderRadius = createMemo<string | undefined>(
    on(rippledElementBoundingBox, () => {
      const el = rippledElement();
      if (el) {
        return getComputedStyle(el).borderRadius;
      }
    })
  );

  return (
    <>
      <Show when={typeof rippledElement() !== 'undefined' && rippledElement() !== null}>
        <Portal>
          <div
            {...props.wrapperProps}
            class={mergeClass(
              'tp-absolute tp-cursor-none tp-pointer-events-none',
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
                'tp-relative tp-overflow-hidden tp-w-full tp-h-full tp-rounded-[inherit] tp-p-0 tp-m-0',
                elProps.class
              )}
              ref={setRippleContainer}
            >
              <For each={ripples}>
                {(ripple) => (
                  <Show when={ripple}>
                    <span
                      class="tp-absolute tp-animate-[ripple_0.6s_linear] tp-rounded-full tp-z-[999] tp-scale-0 tp-opacity-10 tp-bg-[var(--bg)]"
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
                  </Show>
                )}
              </For>
            </div>
          </div>
        </Portal>
      </Show>

      <Ref ref={setRippledElement}>{props.children}</Ref>
    </>
  );
};

export default Ripple;
