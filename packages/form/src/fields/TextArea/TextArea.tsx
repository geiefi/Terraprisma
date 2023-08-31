import { JSX } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';

import { mergeCallbacks } from '@grapos/utils';
import { PossibleColors } from '@grapos/core';

import {
  InputContainer,
  FieldInternalWrapper,
  MaskedFieldPropsKeys,
  MaskedFieldProps,
  FieldName,
  useField,
  setupFieldComponent
} from '../utils';
import { FormValue } from '../../types';

import './TextArea.scss';

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

  color?: PossibleColors;

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any;
}

const TextArea = setupFieldComponent<TextAreaProps, 'textarea', string>(
  (props, elProps) => {
    const {
      elementId: id,

      disabledS: [disabled],
      valueS: [value, setValue],

      focusedS: [_focused, setFocused],
      validate
    } = useField<string>()!;

    return (
      <FieldInternalWrapper>
        <InputContainer labelFor={id()} color={props.color} label={props.label}>
          <textarea
            {...elProps}
            id={id()}
            value={(value() || '').toString()}
            disabled={disabled()}
            class={elProps.class}
            classList={{
              'no-label': typeof props.label === 'undefined',
              ...elProps.classList
            }}
            onInput={mergeCallbacks(
              elProps.onInput as any,
              props.mask ? createInputMask(props.mask) : undefined,
              (
                event: InputEvent & {
                  target: HTMLTextAreaElement;
                  currentTarget: HTMLTextAreaElement;
                }
              ) => {
                event.target.style.height = '0px';
                const scrollHeight = Math.max(event.target.scrollHeight, 54);
                event.target.style.height = `${scrollHeight}px`;

                event.target.parentElement!.style.height = `${scrollHeight}px`;

                if (props.onChange) {
                  props.onChange(event.currentTarget.value, event);
                }

                setValue(event.currentTarget.value);
              }
            )}
            onFocus={mergeCallbacks(elProps.onFocus as any, () => {
              setFocused(true);
            })}
            onBlur={mergeCallbacks(elProps.onBlur as any, () => {
              validate(value());
              setFocused(false);
            })}
          />
        </InputContainer>
      </FieldInternalWrapper>
    );
  },
  [...MaskedFieldPropsKeys, 'label', 'helperText', 'color', 'onChange']
);

export default TextArea;
