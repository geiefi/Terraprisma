import {
  Component,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  JSX,
  on,
  ParentProps,
  Show,
} from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';

import './Tooltip.scss';
import { forwardNativeElementProps } from '../../Helpers';
import { ArrowDropDown } from '../../Icons';

export interface TooltipProps extends ParentProps {
  /**
   * @description The element or bounding box the Tooltip will be anchored to.
   *
   * This is required because it is used to position the tooltip correctly.
   *
   * The bounding box can be used when there is a need to reactively update the
   * positioning of the tooltip based on the anchor and the ref doesn't really update.
   *
   * For example the `<Slider>` component uses this and it has an effect to reset
   * the bounding box signal every time its value changes.
   */
  anchor: HTMLElement | DOMRect;

  visible?: boolean;

  // /**
  //  * @description Weather or not the tooltip should make itself visible once hovered.
  //  *
  //  * Only works if the {@link anchor anchor} is a ref and not a DOMRect.
  //  * This automatically adds MouseEnter and MouseLeave listeners to the {@link anchor anchor}.
  //  *
  //  * @default false
  //  */
  // visibleOnHover?: boolean;

  /**
   * @description The CSS distance between the anchor and the tooltip.
   */
  offsetFromAnchor?: JSX.CSSProperties['top'];

  /**
   * @description The position relative to the {@link anchor anchor}.
   */
  position?: 'left' | 'top' | 'right' | 'bottom';

  style?: JSX.CSSProperties;
}

const Tooltip: Component<TooltipProps> = forwardNativeElementProps<
  TooltipProps,
  HTMLDivElement
>(
  (props, elProps) => {
    const [visible, setVisible] = createSignal(props.visible);

    let mutationObserver: MutationObserver | undefined = undefined;

    const [boundingRect, setBoundingRect] = createSignal<DOMRect>();

    

    createEffect(
      on([() => visible(), () => props.anchor], () => {
        if (props.anchor instanceof HTMLElement) {
          return props.anchor.getBoundingClientRect();
        } else {
          return props.anchor;
        }
      })
    );

    const mouseEnterForVisibleOnHover = () => setVisible(true);
    const mouseLeaveForVisibleOnHover = () => setVisible(false);
    createRenderEffect(() => {
      if (props.anchor instanceof HTMLElement) {
        if (props.visibleOnHover) {
          props.anchor.addEventListener(
            'mouseenter',
            mouseEnterForVisibleOnHover
          );
          props.anchor.addEventListener(
            'mouseleave',
            mouseLeaveForVisibleOnHover
          );
        } else {
          props.anchor.removeEventListener(
            'mouseenter',
            mouseEnterForVisibleOnHover
          );
          props.anchor.removeEventListener(
            'mouseleave',
            mouseLeaveForVisibleOnHover
          );
        }
      }
    });

    createEffect(() => {
      setVisible(props.visible);
    });

    let tooltipEl: HTMLDivElement;

    return (
      <Show when={visible()}>
        <div
          {...elProps}
          class={mergeClass('tooltip', elProps.class)}
          ref={tooltipEl!}
          style={{
            '--anchor-left': `${boundingRect()?.x}px`,
            '--anchor-top': `${boundingRect()?.y}px`,
            '--anchor-width': `${boundingRect()?.width}px`,
            '--anchor-height': `${boundingRect()?.height}px`,

            '--offset-from-anchor': props.offsetFromAnchor || '5px',

            ...props.style,
          }}
          classList={{
            top:
              props.position === 'top' || typeof props.position === 'undefined',
            bottom: props.position === 'bottom',
            left: props.position === 'left',
            right: props.position === 'right',
            ...elProps.classList,
          }}
        >
          {props.children}

          <div class="icon">
            <ArrowDropDown class="icon" style={tooltipEl} />
          </div>
        </div>
      </Show>
    );
  },
  ['anchor', 'visible', 'offsetFromAnchor', 'position', 'children', 'style']
);

export default Tooltip;
