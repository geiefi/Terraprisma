import { type Component, type ParentProps } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import './Collapse.scss';

export interface CollapseProps extends Omit<TransitionProps, 'name'>, ParentProps {
  /**
   * @default 'vertical'
   */
  // orientation?: 'vertical' | 'horizontal';
}

const Collapse: Component<CollapseProps> = (props) => <Transition
  name="collapse"
  {...props}
  onEnter={(el: Element, done) => {
    if (el instanceof HTMLElement) {
      el.style.setProperty('--expected-height', el.scrollHeight + 'px');
    } else {
      console.warn('The <Collapse> transition should be used only with HTML elements!');
      done();
    }
  }}
>
  {props.children}
</Transition>;

export default Collapse;