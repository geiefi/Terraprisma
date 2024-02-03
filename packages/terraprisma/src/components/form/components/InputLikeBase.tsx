import { ComponentProps, JSX, Show, splitProps } from 'solid-js';

import Label from './Label';

// import './InputContainer.scss';
import { mergeRefs } from '@solid-primitives/refs';
import { Accents } from '../../..';
import {
  mergeClass
} from '../../../utils';
import { useField } from './FormField';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type InputLikeBaseProps = LeftIntersection<
  {
    labelFor: string;
    label?: JSX.Element;

    /**
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * @description As the input container has a label inside and the position of the label is changed
     * based on weather the field has content or not, this is the way you can force the label to act like
     * the field has content.
     *
     * @default false
     */
    actLikeHasContent?: boolean;
    icon?: JSX.Element;
    color?: Accents;
    style?: JSX.CSSProperties;
  },
  ComponentProps<'div'>
>;

export const InputLikeBase = (allProps: InputLikeBaseProps) => {
  const [props, elProps] = splitProps(allProps, [
    'labelFor',
    'label',
    'size',
    'actLikeHasContent',
    'icon',
    'color',
    'style'
  ]);
  const color = () => props.color ?? 'accent';
  const {
    focusedS: [focused],
    disabledS: [disabled],
    hasErrors,
    hasContent
  } = useField();

  let inputContainer: HTMLDivElement;

  return (
    <div
      {...elProps}
      ref={mergeRefs(elProps.ref, (r) => (r = inputContainer))}
      data-size={props.size ?? 'medium'}
      class={mergeClass(
        'tp-group tp-box-border tp-w-full data-[size=small]:tp-min-h-[35px] data-[size=medium]:tp-min-h-[44px] data-[size=large]:tp-min-h-[70px] tp-h-fit',
        'tp-relative tp-m-0 data-[size=small]:tp-px-3 data-[size=medium]:tp-px-4 data-[size=large]:tp-px-8',
        'tp-bg-[var(--bg)] tp-text-[var(--fg)] tp-transition-colors',
        'data-[size=small]:tp-text-sm data-[size=medium]:tp-text-base data-[size=large]:tp-text-lg',
        'data-[size=small]:tp-rounded-lg data-[size=medium]:tp-rounded-lg data-[size=large]:tp-rounded-2xl',
        '!tp-outline-none tp-border-solid tp-border focus:focus-visible:tp-border-[var(--color)] focus-visible:tp-border-[var(--color)]',
        focused() ? 'tp-border-[var(--color)]' : 'tp-border-[var(--floating-border)]',
        disabled() && '!tp-cursor-none',
        props.label
          ? 'data-[size=large]:tp-pt-8 data-[size=large]:tp-pb-3 data-[size=medium]:tp-pt-5 data-[size=medium]:tp-pb-2 data-[size=small]:tp-pt-4 data-[size=small]:tp-pb-1.5'
          : 'data-[size=small]:tp-py-2 data-[size=medium]:tp-py-4 data-[size=large]:tp-py-5',
        elProps.class
      )}
      style={{
        '--color': `var(--${color()}-bg)`,
        '--bg': disabled() ? 'var(--muted-bg)' : 'var(--floating-bg)',
        '--fg': disabled() ? 'var(--muted-fg)' : 'var(--floating-fg)',
        ...props.style
      }}
    >
      <Show when={props.label}>
        <Label
          class={mergeClass(
            'tp-font-extrabold tp-absolute tp-origin-top-left tp-transition-all tp-text-inherit',
            'tp-text-ellipsis tp-overflow-x-hidden group-data-[size=small]:tp-left-3 group-data-[size=small]:tp-w-[calc(100%-1rem)] group-data-[size=medium]:tp-left-4 group-data-[size=medium]:tp-w-[calc(100%-2rem)] group-data-[size=large]:tp-left-8 group-data-[size=large]:tp-w-[calc(100%-4rem)]',
            focused() || props.actLikeHasContent || hasContent()
              ? 'group-data-[size=small]:tp-top-1 group-data-[size=medium]:tp-top-1.5 group-data-[size=large]:tp-top-4 group-data-[size=medium]:tp-scale-[0.642] group-data-[size=large]:tp-scale-[0.428] tp-opacity-70'
              : 'group-data-[size=small]:tp-top-4 group-data-[size=medium]:tp-top-5 group-data-[size=large]:tp-top-9 -tp-translate-y-1/2'
          )}
          for={props.labelFor}
          hasErrors={hasErrors()}
        >
          {props.label}
        </Label>
      </Show>

      {elProps.children}

      <span class="tp-bg-[var(--floating-bg)] tp-absolute tp-w-min tp-h-min group-data-[size=small]:tp-right-3 group-data-[size=medium]:tp-right-4 group-data-[size=large]:tp-right-8 tp-top-1/2 -tp-translate-y-1/2 tp-text-[var(--label-color)] tp-text-base tp-select-none tp-pointer-events-none">
        {props.icon}
      </span>
    </div>
  );
};
