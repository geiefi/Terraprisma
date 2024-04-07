import { type Component, type ParentProps, Show } from 'solid-js';

import { Transition, TransitionProps } from 'solid-transition-group';

import './Collapse.scss';
import { resolveFirst } from '@solid-primitives/refs';

export interface CollapseProps
  extends Omit<TransitionProps, 'name'>,
    ParentProps {
  /**
   * @default 'vertical'
   */
  // orientation?: 'vertical' | 'horizontal';
}

const Collapse: Component<CollapseProps> = (props) => {
  const firstChild = resolveFirst(() => props.children);

  return (
    <Transition
      name="collapse"
      {...props}
    >
      <Show when={firstChild() !== null}>
        <div class="grid">{firstChild()}</div>
      </Show>
    </Transition>
  );
};

export default Collapse;
