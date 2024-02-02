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
        'group box-border w-full data-[size=small]:min-h-[35px] data-[size=medium]:min-h-[44px] data-[size=large]:min-h-[70px] h-fit',
        'relative m-0 data-[size=small]:px-3 data-[size=medium]:px-4 data-[size=large]:px-8',
        'bg-[var(--bg)] text-[var(--fg)] transition-colors',
        'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-lg',
        'data-[size=small]:rounded-lg data-[size=medium]:rounded-lg data-[size=large]:rounded-2xl',
        '!outline-none border-solid border focus:focus-visible:border-[var(--color)] focus-visible:border-[var(--color)]',
        focused() ? 'border-[var(--color)]' : 'border-[var(--floating-border)]',
        disabled() && '!cursor-none',
        props.label
          ? 'data-[size=large]:pt-8 data-[size=large]:pb-3 data-[size=medium]:pt-5 data-[size=medium]:pb-2 data-[size=small]:pt-4 data-[size=small]:pb-1.5'
          : 'data-[size=small]:py-2 data-[size=medium]:py-4 data-[size=large]:py-5',
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
            'font-extrabold absolute origin-top-left transition-all text-inherit',
            'text-ellipsis overflow-x-hidden group-data-[size=small]:left-3 group-data-[size=small]:w-[calc(100%-1rem)] group-data-[size=medium]:left-4 group-data-[size=medium]:w-[calc(100%-2rem)] group-data-[size=large]:left-8 group-data-[size=large]:w-[calc(100%-4rem)]',
            focused() || props.actLikeHasContent || hasContent()
              ? 'group-data-[size=small]:top-1 group-data-[size=medium]:top-1.5 group-data-[size=large]:top-4 group-data-[size=medium]:scale-[0.642] group-data-[size=large]:scale-[0.428] opacity-70'
              : 'group-data-[size=small]:top-4 group-data-[size=medium]:top-5 group-data-[size=large]:top-9 -translate-y-1/2'
          )}
          for={props.labelFor}
          hasErrors={hasErrors()}
        >
          {props.label}
        </Label>
      </Show>

      {elProps.children}

      <span class="bg-[var(--floating-bg)] absolute w-min h-min group-data-[size=small]:right-3 group-data-[size=medium]:right-4 group-data-[size=large]:right-8 top-1/2 -translate-y-1/2 text-[var(--label-color)] text-base select-none pointer-events-none">
        {props.icon}
      </span>
    </div>
  );
};
