import {
  JSX,
  createSignal,
  createEffect,
  Show,
  ComponentProps
} from 'solid-js';

import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';
import { Check } from '@terraprisma/icons';

import { useSteps } from './Steps';

export interface StepProps {
  description?: string | JSX.Element;

  style?: JSX.CSSProperties;

  children?: JSX.Element;
}

export const Step = (
  props: Omit<ComponentProps<typeof InternalStep>, 'index'>
) => {
  return props as unknown as JSX.Element;
};

export const InternalStep = makeComponent(
  [
    extendPropsFrom<StepProps & { index: number }, 'div'>([
      'description',
      'index',
      'style',
      'children'
    ])
  ],
  (props, elProps) => {
    const [current] = useSteps()!;

    const [descriptionPRef, setDescriptionPRef] =
      createSignal<HTMLParagraphElement>();
    const [stepInfoRef, setStepInfoRef] = createSignal<HTMLSpanElement>();
    const [descriptionOffset, setDescriptionOffset] =
      createSignal<string>('0px');
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

    return (
      <div
        {...elProps}
        class={mergeClass(
          'relative flex',
          'last-of-type:box-content last-of-type:pr-[var(--description-offset)] last-of-type:w-[var(--step-content-width)] last-of-type:after:!hidden',
          'after:absolute after:top-1/2 after:left-[calc(var(--step-content-width) + 10px)] after:h-1 after:bg-[var(--deeper-bg)]',
          current() === props.index &&
            'after:bg-[var(--accent-bg)] after:text-[var(--accent-fg)] after:transition-colors',
          elProps.class
        )}
        style={{
          '--step-content-width': contentWidth(),
          '--step-content-height': contentHeight(),

          '--description-offset': descriptionOffset(),

          ...props.style
        }}
      >
        <span
          class="flex items-center gap-2 relative h-fit"
          ref={setContentRef}
        >
          <span
            class={mergeClass(
              'rounded-full transition-colors duration-500 bg-[var(--floating-bg)] text-[var(--floating-fg)] select-none w-8 h-8 min-w-[2em] min-h-[2em] flex justify-center items-center',
              current() === props.index &&
                'bg-[var(--accent-bg)] text-[var(--accent-fg)]'
            )}
          >
            <Show when={current() <= props.index} fallback={<Check />}>
              {props.index + 1}
            </Show>
          </span>

          <span class="relative" ref={setStepInfoRef}>
            <p
              class={mergeClass(
                'font-bold max-w-full text-sm m-0 whitespace-nowrap duration-500 text-[var(--normal-fg)]',
                current() === props.index &&
                  current() > props.index &&
                  'font-extrabold text-[var(--normal-fg)] leading-6'
              )}
            >
              {props.children}
            </p>

            <Show when={props.description}>
              <p
                class="absolute w-max font-bold max-w-[200px] text-sm text-[var(--floating-fg)] left-0 top-[3px]"
                ref={setDescriptionPRef}
              >
                {props.description}
              </p>
            </Show>
          </span>
        </span>
      </div>
    );
  }
);
