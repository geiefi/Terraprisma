import { JSX, ParentProps, Show, createMemo } from 'solid-js';

import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

export interface DropdownProps extends ParentProps {
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
   * @description The distance between the Dropdown's anchor and itself in pixels.
   *
   * @default 5
   */
  offsetFromAnchor?: number;

  style?: JSX.CSSProperties;
}

const Dropdown = makeComponent(
  [
    extendPropsFrom<DropdownProps, 'div'>([
      'for',
      'visible',
      'offsetFromAnchor',
      'style',
      'children'
    ])
  ],
  (props, elProps) => {
    const offset = createMemo(() => props.offsetFromAnchor || 5);
    return (
      <Show when={props.visible}>
        <div
          {...elProps}
          class={mergeClass(
            'absolute z-10 h-fit overflow-y-auto overflow-x-hidden rounded-xl box-border p-2',
            'bg-[var(--deeper-bg)] text-[var(--deeper-fg)]',
            elProps.class
          )}
          style={{
            left: `${props.for.offsetLeft}px`,
            top: `${props.for.offsetTop + props.for.clientHeight + offset()}px`,
            width: `${props.for.clientWidth}px`,

            ...props.style
          }}
        >
          {props.children}
        </div>
      </Show>
    );
  }
);

export default Dropdown;