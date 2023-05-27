import {
  Accessor,
  children as accessChildren,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  ParentProps,
  Show,
  useContext
} from "solid-js";

import { StepsContext } from "./StepsContext";

import { Check } from "../../Icons";

import './Steps.scss';
import { mergeClass } from "../../_Shared/Utils";

export type StepProps = {
  description?: string | JSX.Element,
  children: JSX.Element
};

export const Step: Component<StepProps> = (props) => {
  return props as unknown as JSX.Element;
};

const InternalStep: Component<{ index: number } & StepProps> = (props) => {
  const [current, _count] = useSteps()!;

  const [descriptionPRef, setDescriptionPRef] = createSignal<HTMLParagraphElement>();
  const [stepInfoRef, setStepInfoRef] = createSignal<HTMLSpanElement>();
  const [descriptionOffset, setDescriptionOffset] = createSignal<string>('0px');
  createEffect(() => {
    const descriptionP = descriptionPRef();
    const stepInfo = stepInfoRef();
    if (descriptionP && stepInfo) {
      let offset = descriptionP.offsetWidth - stepInfo.offsetWidth;
      offset = Math.max(offset, 0);

      setDescriptionOffset(`${offset}px`);
    }
  });

  const [contentWidth, setContentWidth] = createSignal<string>('0px');
  const [contentHeight, setContentHeight] = createSignal<string>('0px');
  const [contentRef, setContentRef] = createSignal<HTMLSpanElement>();
  createEffect(() => {
    setContentWidth(`${contentRef()?.offsetWidth || 0}px`);
    setContentHeight(`${contentRef()?.offsetHeight || 0}px`);
  });

  return <div
    class='step'
    classList={{
      'current-step': current() === props.index,
      'done-step': current() > props.index
    }}
    style={{ 
      '--step-content-width': contentWidth(),
      '--step-content-height': contentHeight(),

      '--description-offset': descriptionOffset()
    }}
  >
    <span class='step-content' ref={setContentRef}>
      <span class="step-circle">
        <Show when={current() <= props.index} fallback={<Check />}>
          {props.index + 1}
        </Show>
      </span>

      <span class='step-info' ref={setStepInfoRef}>
        <p class='step-title'>{props.children}</p>

        <Show when={props.description}>
          <p class='step-description' ref={setDescriptionPRef}>{props.description}</p>
        </Show>
      </span>
    </span>
  </div>;
}

function isElementAStepProps(el: unknown): el is StepProps {
  return typeof el === 'object' && Object.hasOwn(el || {}, 'children');
}

export type StepsProps = ParentProps<{
  identification: string,
  current: number,

  direction?: 'horizontal' | 'vertical',

  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean | undefined>,

  onFinish?: () => void,
}>;

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
      throw new StepsError(`Cannot set current step to the step at index ${props.current} for` +
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
    <div
      class={mergeClass('steps-container', props.class)}
      classList={{
        'vertical': props.direction === 'vertical',
        'horizontal': props.direction === 'horizontal' || typeof props.direction === 'undefined',
        ...props.classList
      }}
      style={props.style}
    >
      <For each={steps()}>{(step, i) => (
        <InternalStep {...step} index={i()} />
      )}</For>
    </div>
  </StepsContext.Provider>;
}

export default Steps;

export function useSteps() { return useContext(StepsContext) }

