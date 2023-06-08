import type { Component, ParentProps } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import './GrowFade.scss';

const GrowFade: Component<ParentProps<Omit<TransitionProps, 'name'>>> = (props) => (
  <Transition name="grow-fade" {...props}>
    {props.children}
  </Transition>
);

export default GrowFade;
