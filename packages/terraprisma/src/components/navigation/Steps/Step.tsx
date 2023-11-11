import {
  JSX,
  createSignal,
  createEffect,
  Show,
  ComponentProps
} from 'solid-js';
import { useSteps } from './Steps';
import { componentBuilder, extendPropsFrom, mergeClass } from '../../../utils';
import { Check } from '../../icons';

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

export const InternalStep = componentBuilder<StepProps & { index: number }>()
  .factory(
    extendPropsFrom<StepProps & { index: number }, 'div'>([
      'description',
      'index',
      'style',
      'children'
    ])
  )
  .create((props, elProps) => {
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
          'w-full last-of-type:box-content last-of-type:pr-[var(--description-offset)] last-of-type:w-[var(--step-content-width)] last-of-type:after:!hidden',
          'after:content-[""] after:rounded after:w-[calc(100%-var(--step-content-width)-1.5rem)] after:display after:absolute after:top-1/2 after:left-[calc(var(--step-content-width)+0.7rem)] after:h-1 after:translate-y-[-50%] after:bg-[var(--muted-bg)] after:transition-colors',
          current() - 1 >= props.index && 'after:!bg-[var(--accent-bg)]',
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
          class="flex items-center gap-2 relative h-fit w-max"
          ref={setContentRef}
        >
          <span
            class={mergeClass(
              'rounded-full transition-colors duration-500 select-none w-8 h-8 min-w-[2em] min-h-[2em] flex justify-center items-center',
              current() < props.index &&
                'bg-[var(--deeper-bg)] text-[var(--deeper-fg)]',
              current() >= props.index &&
                'bg-[var(--accent-bg)] text-[var(--accent-fg)]'
            )}
          >
            <Show when={current() <= props.index} fallback={<Check />}>
              {props.index + 1}
            </Show>
          </span>

          <span class="relative w-fit" ref={setStepInfoRef}>
            <p
              class={mergeClass(
                'font-extrabold max-w-full text-sm m-0 whitespace-nowrap duration-500',
                current() < props.index && 'text-[var(--muted-fg)]',
                current() === props.index &&
                  current() > props.index &&
                  'text-[var(--normal-fg)] leading-6'
              )}
            >
              {props.children}
            </p>

            <Show when={props.description}>
              <p
                class="absolute w-max font-bold max-w-[200px] text-sm text-[var(--muted-fg)] left-0 top-[3px]"
                ref={setDescriptionPRef}
              >
                {props.description}
              </p>
            </Show>
          </span>
        </span>
      </div>
    );
  });
