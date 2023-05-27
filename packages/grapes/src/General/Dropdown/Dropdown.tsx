import { Component, createEffect, createSignal, JSX, ParentProps, Show, useTransition } from 'solid-js';

import { Transition } from 'solid-transition-group';
import { mergeClass } from '../../_Shared/Utils';

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
  return <Transition name="grow-fade">
    {props.visible && <div
      class={mergeClass('dropdown', props.class)}
      classList={props.classList}
      ref={props.ref}
      style={{
        '--anchor-left': `${props.for.offsetLeft}px`,
        '--anchor-top': `${props.for.offsetTop}px`,
        '--anchor-width': `${props.for.clientWidth}px`,
        '--anchor-height': `${props.for.clientHeight}px`,

        '--offset-from-anchor': props.offsetFromAnchor || '5px'
      }}
    >{props.children}</div>}
  </Transition>;
};

export default Dropdown;
