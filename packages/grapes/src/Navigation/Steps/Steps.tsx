import {
  Accessor,
  children as accessChildren,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  useContext
} from "solid-js";

import { StepsContext } from "./StepsContext";

import { Check } from "../../Icons";

import './Steps.scss';

export type StepProps = {
  description?: string | JSX.Element,
  children: JSX.Element
};

export const Step: Component<StepProps> = (props) => {
  return props as unknown as JSX.Element;
};

const InternalStep: Component<{ index: number } & StepProps> = ({ index, description, children }) => {
  const [current, _count] = useSteps()!;

  const [contentWidth, setContentWidth] = createSignal<string>('0px');
  const [ref, setRef] = createSignal<HTMLSpanElement>();

  createEffect(() => setContentWidth(`${ref()?.offsetWidth}px`));

  return <div
    class='step'
    classList={{
      'current-step': current() === index,
      'done-step': current() > index
    }}
    style={{ '--step-content-width': contentWidth() }}
  >
    <span class='step-content' ref={setRef}>
      <span
        class="step-circle"
      >{current() <= index
        ? index + 1
        : <Check />}</span>
      <span class='step-info'>
        <p class='step-title'>{children}</p>
        {description && <p class='step-description'>{description}</p>}
      </span>
    </span>
  </div>;
}

function isElementAStepProps(el: unknown): el is StepProps {
  return typeof el === 'object' && Object.hasOwn(el || {}, 'children');
}

export type StepsProps = {
  style?: JSX.CSSProperties,
  onFinish?: () => void,
  identification: string,
  current: number,
  children: JSX.Element[]
};

export class StepsError extends Error { }

function Steps(props: StepsProps) {
  const childrenAccessor = accessChildren(() => props.children);
  const steps: Accessor<StepProps[]> = createMemo(() => {
    const children = childrenAccessor() as JSX.Element[];
    return children.filter(child => isElementAStepProps(child)) as unknown as StepProps[];
  });

  const stepsCount = createMemo(() => steps().length);

  createEffect(() => {
    if (props.current > stepsCount()) {
      throw new StepsError(`Cannot set current step to the step at index ${props.current()} for` +
      ` Steps with identification "${props.identification}" because it does not exist!`);
    }

    if (props.current === stepsCount() && props.onFinish) {
      props.onFinish();
    }
  });

  return <StepsContext.Provider value={[
    () => props.current,
    stepsCount
  ]}>
    <div class='steps-container' style={props.style}>
      <For each={steps()}>{(step, i) => (
        <InternalStep {...step} index={i()} />
      )}</For>
    </div>
  </StepsContext.Provider>;
}

export default Steps;

export function useSteps() { return useContext(StepsContext) }

