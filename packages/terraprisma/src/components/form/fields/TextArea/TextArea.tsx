import { JSX, createEffect, createMemo } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';
import { mergeRefs } from '@solid-primitives/refs';

import {
  FieldName,
  FormValue,
  MaskedFieldProps,
  MaskedFieldPropsKeys
} from '../../types';

import './TextArea.css';
import { Accents } from '../../../..';
import {
  componentBuilder,
  addAccentColoring,
  extendPropsFrom,
  mergeClass,
  mergeCallbacks
} from '../../../../utils';
import { InputContainer, FormField } from '../../components';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextAreaProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, string> = FieldName<
    OwnerFormValue,
    string
  >
> extends MaskedFieldProps<OwnerFormValue, string, Name> {
  label?: JSX.Element;

  size?: 'small' | 'medium' | 'large';

  /**
   * @default true
   */
  resizable?: boolean;
  /**
   * @default 'both' or 'none' if {@link resizable} is false
   */
  reisizingDrection?: JSX.CSSProperties['resize'];

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any;
}

const TextArea = componentBuilder<TextAreaProps>()
  .factory(addAccentColoring<TextAreaProps>())
  .factory(
    extendPropsFrom<TextAreaProps & { color?: Accents }, 'textarea'>([
      ...MaskedFieldPropsKeys,
      'label',
      'color',
      'resizable',
      'size',
      'reisizingDrection',
      'onChange'
    ])
  )
  .create((props, color, elProps) => {
    const resizingDirection = () =>
      props.resizable ?? true ? props.reisizingDrection ?? 'both' : 'none';

    return (
      <FormField fieldProperties={props}>
        {({
          elementId: id,

          disabledS: [disabled],
          valueS: [value, setValue],

          focusedS: [focused, setFocused],
          hasContent
        }) => {
          let textarea: HTMLTextAreaElement;
          createEffect(() => {
            if (textarea) {
              textarea.value = (value() ?? '').toString();
            }
          });

          return (
            <InputContainer
              class="max-w-full max-h-full w-full h-full overflow-x-hidden overflow-y-auto"
              style={{
                resize: resizingDirection()
              }}
              size={props.size}
              labelFor={id()}
              color={color()}
              label={props.label}
            >
              <textarea
                {...elProps}
                id={id()}
                ref={mergeRefs(elProps.ref, (r) => (textarea = r))}
                disabled={disabled()}
                class={mergeClass(
                  'border-none outline-none appearance-none bg-transparent w-full h-full min-h-full m-0 p-[inherit] absolute left-0 top-0',
                  'overflow-hidden resize-none transition-opacity opacity-100',
                  typeof props.label === 'undefined' && 'py-2',
                  !focused() && !hasContent() && '!opacity-0',
                  elProps.class
                )}
                onInput={mergeCallbacks(
                  elProps.onInput,
                  props.mask ? createInputMask(props.mask) : undefined,
                  (event) => {
                    event.target.style.height = '0px';
                    requestAnimationFrame(() => {
                      const scrollHeight = Math.max(
                        event.target.scrollHeight,
                        event.target.parentElement!.getBoundingClientRect()
                          .height - 2
                      );
                      event.target.style.height = `${scrollHeight}px`;
                    });

                    if (props.onChange) {
                      props.onChange(event.currentTarget.value, event);
                    }

                    setValue(event.currentTarget.value);
                  }
                )}
                onFocus={mergeCallbacks(elProps.onFocus, () =>
                  setFocused(true)
                )}
                onBlur={mergeCallbacks(elProps.onBlur, () => setFocused(false))}
              />
            </InputContainer>
          );
        }}
      </FormField>
    );
  });

export default TextArea;
