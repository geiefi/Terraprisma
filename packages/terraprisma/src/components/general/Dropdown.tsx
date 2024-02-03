import {
  ComponentProps,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
  splitProps
} from 'solid-js';
import {
  getAbsoluteBoundingRect,
  mergeClass
} from '../../utils';
import { mergeRefs } from '@solid-primitives/refs';
import { LeftIntersection } from '../../types/LeftIntersection';

export type DropdownProps = LeftIntersection<
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
     * <Dropdown for={anchorRef()} visible>
     *   Super gamer dropdown
     * </Dropdown>
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
    align?: 'left' | 'center' | 'right';

    /**
     * @description The distance between the Dropdown's anchor and itself in pixels.
     *
     * @default 5
     */
    offsetFromAnchor?: number;

    style?: JSX.CSSProperties;
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
 * <Dropdown for={anchorRef()} visible>
 *   Super gamer dropdown
 * </Dropdown>
 * ```
 */
const Dropdown = (allProps: DropdownProps) => {
  const [props, elProps] = splitProps(allProps, [
    'for',
    'visible',
    'offsetFromAnchor',
    'style',
    'align',
    'children'
  ]);
  const offset = createMemo(() => props.offsetFromAnchor ?? 10);
  const boundingRect = createMemo(
    on(
      () => [props.for, props.visible],
      () => getAbsoluteBoundingRect(props.for)
    )
  );

  const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();

  const align = createMemo(() => props.align ?? 'center');

  createEffect(
    on(
      () => [props.visible, boundingRect(), dropdownRef()],
      () => {
        const dropdownRefAccessed = dropdownRef();
        if (dropdownRefAccessed) {
          if (align() === 'left') {
            dropdownRefAccessed.style.left = `${boundingRect().left}px`;
            dropdownRefAccessed.style.translate = '0% 0%';
          } else if (align() === 'center') {
            dropdownRefAccessed.style.left = `${
              boundingRect().left + boundingRect().width / 2
            }px`;
            dropdownRefAccessed.style.translate = '-50% 0%';
          } else if (align() === 'right') {
            dropdownRefAccessed.style.left = `${
              boundingRect().left + boundingRect().width
            }px`;
            dropdownRefAccessed.style.translate = '-100% 0%';
          }
          dropdownRefAccessed.style.top = `${
            boundingRect().top + boundingRect().height + offset()
          }px`;
          dropdownRefAccessed.style.width = `${boundingRect().width}px`;

          requestAnimationFrame(() => {
            if (
              dropdownRefAccessed.getBoundingClientRect().bottom >
              window.innerHeight
            ) {
              dropdownRefAccessed.style.top = `${
                boundingRect().top - offset()
              }px`;

              // add an extra -100% on the `y` axis
              if (align() === 'left') {
                dropdownRefAccessed.style.translate = '0 -100%';
              } else if (align() === 'center') {
                dropdownRefAccessed.style.translate = '-50% -100%';
              } else if (align() === 'right') {
                dropdownRefAccessed.style.translate = '-100% -100%';
              }
            }
          });
        }
      }
    )
  );

  return (
    <Show when={props.visible}>
      <div
        {...elProps}
        ref={mergeRefs(elProps.ref, setDropdownRef)}
        class={mergeClass(
          'tp-absolute z-10 tp-h-fit tp-overflow-y-auto tp-overflow-x-hidden tp-rounded-xl tp-box-border tp-p-2',
          'tp-bg-[var(--floating-bg)] tp-text-[var(--floating-fg)] tp-border tp-border-solid tp-border-[var(--floating-border)]',
          elProps.class
        )}
      >
        {props.children}
      </div>
    </Show>
  );
};

export default Dropdown;
