import { ComponentProps, JSX, Show, splitProps } from 'solid-js';

import Label from './Label';

// import './InputContainer.scss';
import { Accents } from '../../..';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { combineStyle } from '@solid-primitives/props';

export type InputLikeBaseProps = LeftIntersection<
  {
    /**
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';

    label?: JSX.Element;

    focused?: boolean;
    disabled?: boolean;
    hasErrors?: boolean;
    hasContent?: boolean;

    icon?: JSX.Element;
    color?: Accents;
  },
  ComponentProps<'div'>
>;

export const InputLikeBase = (allProps: InputLikeBaseProps) => {
  const [props, elProps] = splitProps(allProps, [
    'size',
    'focused',
    'hasContent',
    'hasErrors',
    'disabled',
    'label',
    'icon',
    'color'
  ]);
  const color = () => props.color ?? 'accent';

  return (
    <div
      {...elProps}
      data-size={props.size ?? 'medium'}
      class={mergeClass(
        'group box-border w-full data-[size=small]:min-h-11 data-[size=medium]:min-h-12 data-[size=large]:min-h-16 h-fit',
        'relative m-0 data-[size=small]:px-4 data-[size=medium]:px-5 data-[size=large]:px-7',
        'flex items-center',
        'bg-[var(--bg)] text-[var(--fg)] transition-colors',
        'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-xl',
        'data-[size=small]:rounded-xl data-[size=medium]:rounded-xl data-[size=large]:rounded-xl',
        '!outline-none border-solid border focus:focus-visible:border-[var(--color)] focus-visible:border-[var(--color)]',
        props.focused
          ? 'border-[var(--color)]'
          : 'border-[var(--floating-border)]',
        props.disabled && '!cursor-none',
        // 'data-[size=small]:py-3 data-[size=medium]:py-3.5 data-[size=large]:py-4',
        props.label
          ? 'data-[size=small]:pt-6 data-[size=small]:pb-1.5 data-[size=medium]:pt-7 data-[size=medium]:pb-1.5 data-[size=large]:pt-8 data-[size=large]:pb-1.5'
          : 'data-[size=small]:py-3 data-[size=medium]:py-3.5 data-[size=large]:py-4',
        elProps.class
      )}
      style={combineStyle(
        {
          '--color': `var(--${color()}-bg)`,
          '--bg': props.disabled ? 'var(--muted-bg)' : 'var(--floating-bg)',
          '--fg': props.disabled ? 'var(--muted-fg)' : 'var(--floating-fg)'
        },
        elProps.style
      )}
    >
      <Show when={props.label}>
        <Label
          class={mergeClass(
            'font-semibold absolute origin-top-left transition-all text-inherit',
            'text-ellipsis overflow-x-hidden',
            'group-data-[size=small]:left-4 group-data-[size=small]:w-[calc(100%-2*1rem)]',
            'group-data-[size=medium]:left-5 group-data-[size=medium]:w-[calc(100%-2*1.25rem)]',
            'group-data-[size=large]:left-7 group-data-[size=large]:w-[calc(100%-2*1.75rem)]',
            props.focused || props.hasContent
              ? 'group-data-[size=small]:top-1 group-data-[size=medium]:top-2 group-data-[size=large]:top-1.5 group-data-[size=medium]:scale-[0.642] group-data-[size=large]:scale-[0.428] opacity-70'
              : 'group-data-[size=small]:top-4 group-data-[size=medium]:top-5 group-data-[size=large]:top-9 -translate-y-1/2'
          )}
          hasErrors={props.hasErrors}
        >
          {props.label}
        </Label>
      </Show>

      {elProps.children}

      <span class="bg-[var(--floating-bg)] absolute w-min h-min group-data-[size=small]:right-3 group-data-[size=medium]:right-4 group-data-[size=large]:right-8 top-1/2 -translate-y-1/2 text-[var(--label-color)] text-[1em] select-none pointer-events-none">
        {props.icon}
      </span>
    </div>
  );
};
