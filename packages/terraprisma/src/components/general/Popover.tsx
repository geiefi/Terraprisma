import {
  ComponentProps,
  Show,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  splitProps
} from 'solid-js';

import { mergeRefs } from '@solid-primitives/refs';
import { createMutationObserver } from '@solid-primitives/mutation-observer';
import { combineStyle } from '@solid-primitives/props';
import { useFloating } from 'solid-floating-ui';

import { mergeClass } from '../../utils';
import { LeftIntersection } from '../../types/LeftIntersection';
import { autoUpdate, flip, offset, shift } from '@floating-ui/dom';
import { isServer } from 'solid-js/web';

export type PopoverPosition = Exclude<PopoverProps['position'], undefined>;
export type PopoverAlignment = Exclude<PopoverProps['align'], undefined>;

export type PopoverProps = LeftIntersection<
  {
    /**
     * @description The element the Dropdown will be anchored to.
     *
     * This element is necessary to know where the dropdown will be positioned and
     * sized according to.
     *
     * @example
     *
     * ```jsx
     * const [anchorRef, setAnchorRef] = createSignal(null);
     *
     * <MyElement ref={setAnchorRef} />
     *
     * <Popover for={anchorRef()} visible>
     *   This is an amazing pop over
     * </Popover>
     * ```
     */
    for: HTMLElement;

    /**
     * @default false
     */
    visible?: boolean;

    /**
     * @default 'center'
     */
    align?: 'start' | 'center' | 'end';

    /**
     * @default 'bottom'
     */
    position?: 'top' | 'left' | 'right' | 'bottom';

    /**
     * @description The distance between the Popover's anchor and itself in pixels.
     *
     * @default 5
     */
    offsetFromAnchor?: number;
  },
  ComponentProps<'div'>
>;

/**
 * A component that is very primitive in what it does. Provides you with just an element
 * that will do its best to position itself inside the screen while anchoring into the `for` prop.
 *
 * The Dropdown also has a `visible` prop that handles weather it will show its element or not.
 *
 * @param for The element the Dropdown will be anchored to.
 *
 * @param visible Weather or not the dropdown will be showing or not
 *
 * @param offsetFromAnchor The offset that will be kept between the anchor and the Dropdown
 *
 * @example
 *
 * ```jsx
 * const [anchorRef, setAnchorRef] = createSignal(null);
 *
 * <MyElement ref={setAnchorRef} />
 *
 * <Popover for={anchorRef()} visible>
 *   Super gamer popover
 * </Popover>
 * ```
 */
const Popover = (allProps: PopoverProps) => {
  const [props, elProps] = splitProps(allProps, [
    'for',
    'visible',
    'offsetFromAnchor',
    'align',
    'position'
  ]);

  const [popoverRef, setPopoverRef] = createSignal<HTMLDivElement>();

  const position = useFloating(
    () => props.for,
    popoverRef,
    {
      get placement() {
        const alignment = props.align ?? 'center';
        const position = props.position ?? 'bottom';

        return alignment === 'center' ? position : `${position}-${alignment}` as const;
      },
      strategy: 'fixed',
      whileElementsMounted: autoUpdate,
      get middleware() {
        return [offset(props.offsetFromAnchor ?? 5), flip(), shift()]
      }
    }
  );

  return (
    <Show when={props.visible}>
      <div
        {...elProps}
        ref={mergeRefs(elProps.ref, (ref) => setPopoverRef(ref))}
        style={combineStyle(elProps.style, {
          left: `${position?.x ?? 0}px`,
          top: `${position?.y ?? 0}px`
        })}
        class={mergeClass(
          'fixed z-auto h-fit overflow-y-auto overflow-x-hidden rounded-xl box-border p-2',
          'bg-[var(--floating-bg)] text-[var(--floating-fg)] border border-solid border-[var(--floating-border)]',
          elProps.class
        )}
      >
        {elProps.children}
      </div>
    </Show>
  );
};

export default Popover;
