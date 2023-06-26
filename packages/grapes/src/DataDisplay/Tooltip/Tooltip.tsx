import {
  ComponentProps,
  createEffect,
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

/**
 * @description The same as a Tooltip component but rather creates the Tooltip component when this is called
 * and then you need to render the returning component.
 *
 * @param identification The identification of the Tooltip. This is important because it makes
 * it much easier to find where errors and warnings are.
 *
 * @see {@link Tooltip}
 */
export function createTooltip(identification: string) {
  const [anchorRef, setAnchorRef] = createSignal<HTMLElement>();

  let updateBoundingBox: (() => void) | undefined = undefined;

  return {
    setAnchor: setAnchorRef,
    updateBoundingBox: () => {
      if (updateBoundingBox) {
        updateBoundingBox();
      } else {
        console.warn(`Tooltip ${identification}: Could not call updateBoundingBox manually due to missing Tooltip in the DOM.
        Maybe you need to add <Tooltip></Tooltip> to your component?`);
      }
    },
    Tooltip: forwardNativeElementProps<
      TooltipProps,
      HTMLDivElement
    >(
      (props, elProps) => {
        const [visible, setVisible] = createSignal(props.visible);

        const [boundingRect, setBoundingRect] = createSignal<DOMRect>();

        // eslint-disable-next-line solid/reactivity
        updateBoundingBox = () => {
          const anchor = anchorRef();
          if (anchor) {
            setBoundingRect(anchor.getBoundingClientRect());
          } else {
            console.warn(`Tooltip ${identification}: Could not determine bounding box due to missing anchor ref.
            Are your forgetting to call setAnchor for it?`);
          }
        }

        createEffect(
          on([visible, anchorRef], () => updateBoundingBox!())
        );

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

                '--offset-from-anchor': props.offsetFromAnchor || '12px',

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
              <div class="tooltip-content">
                {props.children}

                <span class="icon"><ArrowDropDown /></span>
              </div>
            </div>
          </Show>
        );
      },
      ['visible', 'offsetFromAnchor', 'position', 'children', 'style']
    )
  };
}

/**
 * @description A tooltip component, a small box that appears at a certain specified offset from an anchor
 * when it is visible. 
 *
 * There is a also a {@link createTooltip} pattern for when you need to update the positioning of the
 * Tooltip in a data driven way.
 */
const Tooltip = (props: TooltipProps & { identification: string; anchor: HTMLElement; } & ComponentProps<'div'>) => {
  // eslint-disable-next-line solid/reactivity
  const { setAnchor, Tooltip: Comp } = createTooltip(props.identification);

  createEffect(() => setAnchor(props.anchor));

  return <><Comp {...props} /></>;
};

export default Tooltip

