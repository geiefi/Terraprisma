import { type Component, type JSX, type ParentProps } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import './GrowFade.scss';

export interface GrowFadeProps extends Omit<TransitionProps, 'name'>, ParentProps {
  growingOrigin?: JSX.CSSProperties['transform-origin'];
}

const GrowFade: Component<GrowFadeProps> = (props) => (
  <Transition name={`grow-fade-${props.growingOrigin || 'center'}`} {...props}>
    {props.children}
  </Transition>
);

export default GrowFade;