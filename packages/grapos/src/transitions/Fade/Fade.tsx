import type { Component, ParentProps } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import './Fade.scss';

const Fade: Component<ParentProps<Omit<TransitionProps, 'name'>>> = (props) => (
  <Transition name="fade" {...props}>
    {props.children}
  </Transition>
);

export default Fade;
