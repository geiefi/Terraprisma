import { type Component, type ParentProps } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import './Collapse.scss';

export interface CollapseProps extends Omit<TransitionProps, 'name'>, ParentProps {
  /**
   * @default 'top'
   */
  origin?: 'top' | 'left' | 'bottom' | 'right';
}

const Collapse: Component<CollapseProps> = (props) => (
  <Transition name={`collapse-${props.origin || 'top'}`} {...props}>
    {props.children}
  </Transition>
);

export default Collapse;