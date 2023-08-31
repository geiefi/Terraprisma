import { JSX, createEffect } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';

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

import { mergeClass, mergeCallbacks } from '@grapos/utils';

import './Input.scss';
import { PossibleColors } from '@grapos/core';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'email'
  | 'password'
  | undefined;
export type InputBaseValue<Type> = Type extends 'text'
  ? string
  : Type extends 'email'
  ? string
  : Type extends 'number'
  ? number
  : Type extends 'password'
  ? string
  : string;

export interface InputProps<
  OwnerFormValue extends FormValue = FormValue,
  Type extends InputType = undefined,
  Name extends FieldName<OwnerFormValue, InputBaseValue<Type>> = FieldName<
    OwnerFormValue,
    InputBaseValue<Type>
  >
> extends MaskedFieldProps<OwnerFormValue, InputBaseValue<Type>, Name> {
  label?: JSX.Element;

  type?: Type;
  color?: PossibleColors;

  onChange?: (value: string, event?: InputOnChangeEvent) => void;
}

const Input = setupFieldComponent<
  InputProps,
  'input',
  InputBaseValue<undefined>
>(
  (props, elProps) => {
    const {
      elementId: id,
      disabledS: [disabled],
      focusedS: [_focused, setFocused],
      valueS: [value, setValue],
      validate
    } = useField()!;

    createEffect(() => {
      if (
        props.mask &&
        typeof props.type !== 'undefined' &&
        props.type === 'number'
      ) {
        throw new Error(
          `Error with Input named ${props.name}: Cannot have a mask on a number input!`
        );
      }
    });

    return (
      <FieldInternalWrapper>
        {/* TODO: pass the color through here to work with the new coloring variables */}
        <InputContainer labelFor={id()} label={props.label}>
          <input
            {...elProps}
            id={id()}
            disabled={disabled()}
            class={mergeClass('input', elProps.class)}
            color={props.color}
            classList={{
              'no-label': typeof props.label === 'undefined'
            }}
            value={(value() || '') as string}
            onInput={mergeCallbacks(
              elProps.onInput as any,
              props.mask ? createInputMask(props.mask) : undefined,
              (
                event: InputEvent & {
                  target: HTMLInputElement;
                  currentTarget: HTMLInputElement;
                }
              ) => {
                const ref = event.currentTarget || event.target;
                if (props.onChange) {
                  props.onChange(ref.value, event);
                }

                setValue(ref.value);
                // eslint-disable-next-line no-self-assign
                ref.value = ref.value;
              }
            )}
            onFocus={mergeCallbacks(elProps.onFocus as any, () =>
              setFocused(true)
            )}
            onBlur={mergeCallbacks(elProps.onBlur as any, () => {
              validate(value());
              setFocused(false);
            })}
          />
        </InputContainer>
      </FieldInternalWrapper>
    );
  },
  [
    'mask',
    'label',
    'helperText',
    'type',
    'color',
    'onChange',
    ...MaskedFieldPropsKeys
  ]
) as <
  OwnerFormValue extends FormValue,
  Type extends InputType = undefined,
  Name extends FieldName<OwnerFormValue, InputBaseValue<Type>> = FieldName<
    OwnerFormValue,
    InputBaseValue<Type>
  >
>(
  props: InputProps<OwnerFormValue, Type, Name> &
    JSX.InputHTMLAttributes<HTMLInputElement>
) => JSX.Element;

export default Input;
