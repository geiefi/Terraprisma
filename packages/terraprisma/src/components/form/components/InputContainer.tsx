import { JSX, ParentProps, Show } from 'solid-js';

import Label from './Label';

// import './InputContainer.scss';
import { mergeRefs } from '@solid-primitives/refs';
import { Accents } from '../../..';
import {
  componentBuilder,
  addAccentColoring,
  extendPropsFrom,
  mergeClass
} from '../../../utils';
import { useField } from '../fields/FieldContext';

export interface InputContainerProps extends ParentProps {
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
  style?: JSX.CSSProperties;
}

const InputContainer = componentBuilder<InputContainerProps>()
  .factory(addAccentColoring<InputContainerProps>())
  .factory(
    extendPropsFrom<InputContainerProps & { color?: Accents }, 'div'>([
      'children',
      'labelFor',
      'actLikeHasContent',
      'label',
      'style',
      'size',
      'icon'
    ])
  )
  .create((props, color, elProps) => {
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
          'group w-full min-h-[54px] h-fit text-sm',
          'relative m-0 data-[size=small]:px-2 data-[size=medium]:px-4 data-[size=large]:px-8',
          'bg-[var(--bg)] text-[var(--fg)] transition-colors',
          'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-lg',
          'data-[size-small]:rounded-[0.625rem] data-[size=medium]:rounded-2xl data-[size=large]:rounded-lg',
          '!outline-none border-solid border focus:focus-visible:border-[var(--color)] focus-visible:border-[var(--color)]',
          focused()
            ? 'border-[var(--color)]'
            : 'border-[var(--floating-border)]',
          disabled() && '!cursor-none',
          props.label
            ? 'data-[size=large]:pt-8 data-[size=large]:pb-3 data-[size=medium]:pt-5 data-[size=medium]:pb-2'
            : 'data-[size=small]:py-2.5 data-[size=medium]:py-3.5 data-[size=large]:py-6',
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
              'font-extrabold text-xs absolute origin-top-left left-5 -translate-y-1/2 transition-all',
              focused() || props.actLikeHasContent || hasContent()
                ? 'top-5 scale-[0.666] opacity-70'
                : 'data-[size=small]:top-2.5 data-[size=medium]:top-3.5 data-[size=large]:top-6'
            )}
            for={props.labelFor}
            hasErrors={hasErrors()}
          >
            {props.label}
          </Label>
        </Show>

        {props.children}

        <span class="bg-[var(--floating-bg)] absolute w-min h-min left-[calc(100%-36px)] top-[calc(50%-8px)] text-[var(--label-color)] text-base select-none pointer-events-none">
          {props.icon}
        </span>
      </div>
    );
  });

export default InputContainer;
