import {
  JSX,
  createSignal,
  createEffect,
  Show,
  ComponentProps,
  splitProps
} from 'solid-js';
import { useSteps } from './Steps';
import { mergeClass } from '../../../utils';
import { Check } from '../../icons';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type StepProps = LeftIntersection<
  {
    description?: string | JSX.Element;

    style?: JSX.CSSProperties;
  },
  ComponentProps<'div'>
>;

export const Step = (
  props: StepProps
) => {
  return props as unknown as JSX.Element;
};

export const InternalStep = (allProps: StepProps & { index: number }) => {
  const [props, elProps] = splitProps(allProps, ['description', 'index']);
  const [current] = useSteps()!;

  const [descriptionPRef, setDescriptionPRef] =
    createSignal<HTMLParagraphElement>();
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

  return (
    <div
      {...elProps}
      class={mergeClass(
        'tp-relative tp-flex',
        'tp-w-full last-of-type:tp-box-content last-of-type:tp-pr-[var(--description-offset)] last-of-type:tp-w-[var(--step-content-width)] last-of-type:after:!tp-hidden',
        'after:tp-content-[""] after:tp-rounded after:tp-w-[calc(100%-var(--step-content-width)-1.5rem)] after:tp-display after:tp-absolute after:tp-top-1/2 after:tp-left-[calc(var(--step-content-width)+0.7rem)] after:tp-h-1 after:tp-translate-y-[-50%] after:tp-bg-[var(--muted-bg)] after:tp-transition-colors',
        current() - 1 >= props.index && 'after:!tp-bg-[var(--accent-bg)]',
        elProps.class
      )}
      style={{
        '--step-content-width': contentWidth(),
        '--step-content-height': contentHeight(),

        '--description-offset': descriptionOffset(),

        ...elProps.style
      }}
    >
      <span
        class="tp-flex tp-items-center tp-gap-2 tp-relative tp-h-fit tp-w-max"
        ref={setContentRef}
      >
        <span
          class={mergeClass(
            'tp-rounded-full tp-transition-colors tp-duration-500 tp-select-none tp-w-8 tp-h-8 tp-min-w-[2em] tp-min-h-[2em] tp-flex tp-justify-center tp-items-center',
            current() < props.index &&
              'tp-bg-[var(--deeper-bg)] tp-text-[var(--deeper-fg)]',
            current() >= props.index &&
              'tp-bg-[var(--accent-bg)] tp-text-[var(--accent-fg)]'
          )}
        >
          <Show when={current() <= props.index} fallback={<Check />}>
            {props.index + 1}
          </Show>
        </span>

        <span class="tp-relative tp-w-fit" ref={setStepInfoRef}>
          <p
            class={mergeClass(
              'tp-font-extrabold tp-max-w-full tp-text-sm tp-m-0 tp-whitespace-nowrap tp-duration-500',
              current() < props.index && 'tp-text-[var(--muted-fg)]',
              current() === props.index &&
                current() > props.index &&
                'tp-text-[var(--normal-fg)] tp-leading-6'
            )}
          >
            {elProps.children}
          </p>

          <Show when={props.description}>
            <p
              class="tp-absolute tp-w-max tp-font-bold tp-max-w-[200px] tp-text-sm tp-text-[var(--muted-fg)] tp-left-0 tp-top-[3px]"
              ref={setDescriptionPRef}
            >
              {props.description}
            </p>
          </Show>
        </span>
      </span>
    </div>
  );
};
