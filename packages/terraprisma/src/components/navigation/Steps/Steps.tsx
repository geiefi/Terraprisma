import {
  Accessor,
  children as accessChildren,
  createEffect,
  createMemo,
  For,
  JSX,
  useContext,
  createContext,
  ComponentProps,
  splitProps
} from 'solid-js';

import { InternalStep, StepProps } from './Step';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { Accents } from '../../../theming';

export type StepsContextProviderValue = [
  current: Accessor<number>,
  count: Accessor<number>
];

export const StepsContext = createContext<StepsContextProviderValue>();

function isElementAStepProps(el: unknown): el is StepProps {
  return typeof el === 'object' && Object.hasOwn(el || {}, 'children');
}

export type StepsProps = LeftIntersection<
  {
    identification: string;
    current: number;

    color?: Accents;

    // TODO: implement vertical steps
    // direction?: 'horizontal' | 'vertical';

    onFinish?: () => void;
  },
  ComponentProps<'div'>
>;

export class StepsError extends Error {}

const Steps = (allProps: StepsProps) => {
  const [props, elProps] = splitProps(allProps, [
    'identification',
    'current',
    'color',
    'onFinish'
  ]);
  const childrenAccessor = accessChildren(() => elProps.children);
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
};

export default Steps;

export function useSteps() {
  return useContext(StepsContext);
}
