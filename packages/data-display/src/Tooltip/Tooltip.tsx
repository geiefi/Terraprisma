import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  ParentProps,
  Show
} from 'solid-js';

import {
  mergeClass,
  componentBuilder,
  extendPropsFrom,
  getAbsoluteBoundingRect
} from '@terraprisma/utils';

import './Tooltip.scss';

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
    Tooltip: componentBuilder<TooltipProps>()
      .factory(
        extendPropsFrom<TooltipProps, 'div'>([
          'visible',
          'offsetFromAnchor',
          'position',
          'children',
          'style'
        ])
      )
      .create((props, elProps) => {
        const [visible, setVisible] = createSignal(props.visible);

        const [boundingRect, setBoundingRect] = createSignal<DOMRect>();

        // eslint-disable-next-line solid/reactivity
        updateBoundingBox = () => {
          const anchor = anchorRef();
          if (anchor) {
            setBoundingRect(getAbsoluteBoundingRect(anchor));
          } else {
            console.warn(`Tooltip ${identification}: Could not determine bounding box due to missing anchor ref.
            Are your forgetting to call setAnchor for it?`);
          }
        };

        createEffect(on([visible, anchorRef], () => updateBoundingBox!()));

        createEffect(() => {
          setVisible(props.visible);
        });

        const position = createMemo(() => props.position ?? 'top');

        let tooltipEl: HTMLDivElement;

        return (
          <>
            <Show when={visible()}>
              <div
                {...elProps}
                class={mergeClass(
                  'tooltip absolute w-fit z-10 pointer-events-none select-none rounded-md bg-[var(--deeper-bg)] text-[var(--deeper-fg)] px-2 py-0.5',
                  position() === 'top' &&
                    'left-[calc(var(--anchor-left)+var(--anchor-width)/2)] top-[var(--anchor-top)] top',
                  position() === 'left' &&
                    'left-[var(--anchor-left)] top-[calc(var(--anchor-top)+var(--anchor-height)/2)] left',
                  position() === 'right' &&
                    'left-[calc(var(--anchor-left)+var(--anchor-width)+var(--offset-from-anchor))] top-[calc(var(--anchor-top)+var(--anchor-height)/2)] right',
                  position() === 'bottom' &&
                    'left-[calc(var(--anchor-left)+var(--anchor-width)/2)] top-[calc(var(--anchor-top)+var(--anchor-height)+var(--offset-from-anchor))] bottom',
                  elProps.class
                )}
                ref={tooltipEl!}
                style={{
                  '--anchor-left': `${boundingRect()?.x}px`,
                  '--anchor-top': `${boundingRect()?.y}px`,
                  '--anchor-width': `${boundingRect()?.width}px`,
                  '--anchor-height': `${boundingRect()?.height}px`,

                  '--offset-from-anchor': props.offsetFromAnchor || '12px',

                  ...props.style
                }}
              >
                {props.children}
              </div>
            </Show>
          </>
        );
      })
  };
}

/**
 * @description A tooltip component, a small box that appears at a certain specified offset from an anchor
 * when it is visible.
 *
 * There is a also a {@link createTooltip} pattern for when you need to update the positioning of the
 * Tooltip in a data driven way.
 */
const Tooltip = (
  props: TooltipProps & {
    identification: string;
    anchor: HTMLElement;
  } & ComponentProps<'div'>
) => {
  // eslint-disable-next-line solid/reactivity
  const { setAnchor, Tooltip: Comp } = createTooltip(props.identification);

  createEffect(() => setAnchor(props.anchor));

  return (
    <>
      <Comp {...props} />
    </>
  );
};

export default Tooltip;
