import { Component, JSX, ParentProps, Show, splitProps } from 'solid-js';

import { mergeClass } from '../../_Shared/Utils';

import GrowFade from '../../Transitions/GrowFade/GrowFade';

import './Dropdown.scss';

export interface DropdownProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement> {
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
   * @description The distance between the Dropdown's anchor and itself.
   *
   * @default 5px
   */
  offsetFromAnchor?: JSX.CSSProperties['top'];

  style?: JSX.CSSProperties;
}

const Dropdown: Component<DropdownProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['for', 'visible', 'offsetFromAnchor']);

  return <GrowFade>
    <Show when={props.visible}>
      <div
        {...elProps}
        class={mergeClass('dropdown', elProps.class)}
        style={{
          '--anchor-left': `${props.for.offsetLeft}px`,
          '--anchor-top': `${props.for.offsetTop}px`,
          '--anchor-width': `${props.for.clientWidth}px`,
          '--anchor-height': `${props.for.clientHeight}px`,

          '--offset-from-anchor': props.offsetFromAnchor || '5px',
          ...elProps.style
        }}
      >{elProps.children}</div>
    </Show>
  </GrowFade>;
};

export default Dropdown;
