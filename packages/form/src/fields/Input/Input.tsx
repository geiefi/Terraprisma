import { JSX, createEffect, onMount } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';

import { Accents, addAccentColoring } from '@terraprisma/core';
import {
  mergeClass,
  mergeCallbacks,
  makeComponent,
  extendPropsFrom
} from '@terraprisma/utils';

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

import './Input.scss';

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

  onChange?: (value: string, event?: InputOnChangeEvent) => void;
}

const Input = setupFieldComponent<InputBaseValue<undefined>>().with(
  makeComponent(
    [
      addAccentColoring<InputProps>(),
      extendPropsFrom<InputProps & { color?: Accents }, 'input'>([
        'mask',
        'label',
        'helperText',
        'type',
        'color',
        'onChange',
        ...MaskedFieldPropsKeys
      ])
    ],
    (props, color, elProps) => {
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

      createEffect(() => {
        const inputEl = document.getElementById(id())! as HTMLInputElement;
        inputEl.value = (value() ?? '').toString();
      });

      return (
        <FieldInternalWrapper>
          <InputContainer color={color()} labelFor={id()} label={props.label}>
            <input
              {...elProps}
              id={id()}
              disabled={disabled()}
              class={mergeClass('input', elProps.class)}
              color={color()}
              classList={{
                'no-label': typeof props.label === 'undefined'
              }}
              onInput={mergeCallbacks(
                elProps.onInput,
                props.mask ? createInputMask(props.mask) : undefined,
                (event) => {
                  const ref = event.currentTarget || event.target;
                  if (props.onChange) {
                    props.onChange(ref.value, event);
                  }

                  setValue(ref.value);
                  // eslint-disable-next-line no-self-assign
                  ref.value = ref.value;
                }
              )}
              onFocus={mergeCallbacks(elProps.onFocus, () => setFocused(true))}
              onBlur={mergeCallbacks(elProps.onBlur, () => {
                validate(value());
                setFocused(false);
              })}
            />
          </InputContainer>
        </FieldInternalWrapper>
      );
    }
  )
);

export default Input;
