import { ComponentProps, JSX, createEffect, splitProps } from 'solid-js';

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
  mergeClass,
  mergeCallbacks
} from '../../../../utils';
import { InputLikeBase, FormField } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export type TextAreaProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, string> = FieldName<
    OwnerFormValue,
    string
  >
> = LeftIntersection<
  MaskedFieldProps<OwnerFormValue, string, Name> & {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';

    /**
     * @default true
     */
    resizable?: boolean;
    color?: Accents;
    /**
     * @default 'both' or 'none' if {@link resizable} is false
     */
    reisizingDrection?: JSX.CSSProperties['resize'];

    onChange?: (newValue: string, event?: TextAreaChangeEvent) => any;
  },
  ComponentProps<'textarea'>
>;

const TextArea = (allProps: TextAreaProps) => {
  const [props, elProps] = splitProps(allProps, [
    ...MaskedFieldPropsKeys,
    'label',
    'color',
    'resizable',
    'size',
    'reisizingDrection',
    'onChange'
  ]);
  const color = () => props.color ?? 'accent';
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
          <InputLikeBase
            class="tp-max-w-full tp-max-h-full tp-w-full tp-h-full tp-overflow-x-hidden tp-overflow-y-auto"
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
                'tp-border-none tp-outline-none tp-appearance-none tp-bg-transparent tp-w-full tp-h-full tp-min-h-full tp-m-0 tp-p-[inherit] tp-absolute tp-left-0 tp-top-0',
                'tp-overflow-hidden tp-resize-none tp-transition-opacity tp-opacity-100',
                typeof props.label === 'undefined' && 'tp-py-2',
                !focused() && !hasContent() && '!tp-opacity-0',
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
              onFocus={mergeCallbacks(elProps.onFocus, () => setFocused(true))}
              onBlur={mergeCallbacks(elProps.onBlur, () => setFocused(false))}
            />
          </InputLikeBase>
        );
      }}
    </FormField>
  );
};

export default TextArea;
