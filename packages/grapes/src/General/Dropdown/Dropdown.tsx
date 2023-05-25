import { Component, JSX, ParentProps, Show } from 'solid-js';

import './Dropdown.scss';

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
   * @description The distance between the Dropdown's anchor and itself.
   *
   * @default 5px
   */
  offsetFromAnchor?: JSX.CSSProperties['top'];
  
  ref?: (el: HTMLDivElement) => void,
  style?: JSX.CSSProperties;
  class?: string;
  classList?: Record<string, boolean | undefined>;
}

const Dropdown: Component<DropdownProps> = (props) => {
  return <Show when={props.visible === true}>
    <div
      class={`dropdown ${props.class || ''}`}
      classList={props.classList}
      ref={props.ref}
      style={{
        '--anchor-left': `${props.for.offsetLeft}px`,
        '--anchor-top': `${props.for.offsetTop}px`,
        '--anchor-width': `${props.for.clientWidth}px`,
        '--anchor-height': `${props.for.clientHeight}px`,

        '--offset-from-anchor': props.offsetFromAnchor || '5px'
      }}
    >{props.children}</div>
  </Show>;
};

export default Dropdown;
