import { Component, createMemo, JSX, on, Show, splitProps } from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';

import './Tooltip.scss';

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
  for: HTMLElement | DOMRect;
  visible?: boolean;

  /**
   * @description The CSS distance between the anchor and the tooltip.
   */
  offsetFromAnchor?: JSX.CSSProperties['top'];

  /**
   * @description The position relative to the `anchor`.
   */
  position?: 'left' | 'top' | 'right' | 'bottom';
}

const Tooltip: Component<TooltipProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    ['for', 'visible', 'offsetFromAnchor', 'position']
  );

  // eslint-disable-next-line solid/reactivity
  const boundingRect = createMemo(
    on(
      [
        () => props.visible,
        () => props.for
      ],
      () => {
        if (props.for instanceof HTMLElement) {
          return props.for.getBoundingClientRect();
        } else {
          return props.for;
        }
      }
    )
  );

  return <Show when={props.visible}>
    <div
      {...elProps}
      class={mergeClass('tooltip', elProps.class)}
      style={{
        '--anchor-left': `${boundingRect()?.x}px`,
        '--anchor-top': `${boundingRect()?.y}px`,
        '--anchor-width': `${boundingRect()?.width}px`,
        '--anchor-height': `${boundingRect()?.height}px`,

        '--offset-from-anchor': props.offsetFromAnchor || '5px',
      }}
      classList={{
        'top': props.position === 'top' || typeof props.position === 'undefined',
        'bottom': props.position === 'bottom',
        'left': props.position === 'left',
        'right': props.position === 'right',
        ...elProps.classList
      }}
    >
      {elProps.children}
      {/*<ArrowDropDown variant="sharp" />*/}
    </div>
  </Show>;
};

export default Tooltip;
