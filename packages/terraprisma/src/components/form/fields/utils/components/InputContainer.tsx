import { JSX, ParentProps, Show } from 'solid-js';

import { useField } from '../fields';

import {
  componentBuilder,
  extendPropsFrom,
  mergeClass
} from '~';

import Label from './Label';

// import './InputContainer.scss';
import { Accents, addAccentColoring } from '~';
import { mergeRefs } from '@solid-primitives/refs';

export interface InputContainerProps extends ParentProps {
  labelFor: string;
  label?: JSX.Element;

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
        class={mergeClass(
          'w-full min-h-[54px] h-fit text-sm',
          'relative m-0 px-5',
          'bg-[var(--bg)] text-[var(--fg)] transition-colors',
          '!outline-none rounded-[0.7rem] border-solid border focus:focus-visible:border-[var(--color)] focus-visible:border-[var(--color)]',
          focused()
            ? 'border-[var(--color)]'
            : 'border-[var(--floating-border)]',
          disabled() && '!cursor-none',
          props.label ? 'pt-5 pb-2' : 'py-3.5',
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
                ? 'top-[1.125rem] scale-[0.666] opacity-70'
                : 'top-7'
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
