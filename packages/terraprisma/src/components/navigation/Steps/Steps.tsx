import {
  Accessor,
  children as accessChildren,
  createEffect,
  createMemo,
  For,
  JSX,
  useContext,
  createContext,
  ParentProps
} from 'solid-js';

import { mergeClass, componentBuilder, extendPropsFrom } from 'utils';

import { InternalStep, StepProps } from './Step';

export type StepsContextProviderValue = [
  current: Accessor<number>,
  count: Accessor<number>
];

export const StepsContext = createContext<StepsContextProviderValue>();

function isElementAStepProps(el: unknown): el is StepProps {
  return typeof el === 'object' && Object.hasOwn(el || {}, 'children');
}

export interface StepsProps extends ParentProps {
  identification: string;
  current: number;

  // TODO: implement vertical steps
  // direction?: 'horizontal' | 'vertical';

  onFinish?: () => void;
}

export class StepsError extends Error {}

const Steps = componentBuilder<StepsProps>()
  .factory(
    extendPropsFrom<StepsProps, 'div'>([
      'identification',
      'current',
      'onFinish',
      'children'
    ])
  )
  .create((props, elProps) => {
    const childrenAccessor = accessChildren(() => props.children);
    const steps: Accessor<StepProps[]> = createMemo(() => {
      const children = childrenAccessor() as JSX.Element[];
      return children.filter((child) =>
        isElementAStepProps(child)
      ) as unknown as StepProps[];
    });

    const stepsCount = createMemo(() => steps().length);

    createEffect(() => {
      if (props.current > stepsCount()) {
        throw new StepsError(
          `Cannot set current step to the step at index ${props.current} for` +
            ` Steps with identification "${props.identification}" because it does not exist!`
        );
      }

      if (props.current === stepsCount() && props.onFinish) {
        props.onFinish();
      }
    });

    const current = createMemo(() => props.current);

    return (
      <StepsContext.Provider value={[current, stepsCount]}>
        <div
          {...elProps}
          class={mergeClass(
            'relative flex justify-between my-8 w-full px-2',
            elProps.class
          )}
        >
          <For each={steps()}>
            {(step, i) => <InternalStep {...step} index={i()} />}
          </For>
        </div>
      </StepsContext.Provider>
    );
  });

export default Steps;

export function useSteps() {
  return useContext(StepsContext);
}
