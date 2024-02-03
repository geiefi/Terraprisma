import { ComponentProps, JSX, createEffect, splitProps } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';
import { mergeRefs } from '@solid-primitives/refs';

import {
  FieldName,
  FormValue,
  MaskedFieldProps,
  MaskedFieldPropsKeys
} from '../../types';

import './Input.css';
import { Accents } from '../../../..';
import {
  mergeClass,
  mergeCallbacks
} from '../../../../utils';
import { FormField, InputLikeBase } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';

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
export type InputBaseValue<Type extends InputType> = Type extends 'number'
  ? number
  : string;

export type InputProps<
  Type extends InputType = InputType,
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, InputBaseValue<Type>> = FieldName<
    OwnerFormValue,
    InputBaseValue<Type>
  >
> = LeftIntersection<
  MaskedFieldProps<OwnerFormValue, InputBaseValue<Type>, Name> & {
    label?: JSX.Element;

    type?: Type;

    size?: 'small' | 'medium' | 'large';

    color?: Accents;

    onChange?: (
      value: MaskedFieldProps<
        OwnerFormValue,
        InputBaseValue<Type>,
        Name
      >['value'],
      event?: InputOnChangeEvent
    ) => void;
  },
  ComponentProps<'input'>
>;

export const Input = <
  Type extends InputType,
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, InputBaseValue<Type>> = FieldName<
    OwnerFormValue,
    InputBaseValue<Type>
  >
>(
  allProps: InputProps<Type, OwnerFormValue, Name>
) => {
  const [props, elProps] = splitProps(allProps, [
    'mask',
    'label',
    'helperText',
    'type',
    'size',
    'color',
    'onChange',
    ...MaskedFieldPropsKeys
  ]);

  const color = () => props.color ?? 'accent';

  type FieldValue = (typeof props)['value'];

  return (
    <FormField fieldProperties={props}>
      {({
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        hasContent
      }) => {
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

        let input: HTMLInputElement;

        createEffect(() => {
          if (input) {
            input.value = (value() ?? '').toString();
          }
        });

        return (
          <InputLikeBase
            size={props.size}
            color={color()}
            labelFor={id()}
            label={props.label}
          >
            <input
              {...elProps}
              id={id()}
              ref={mergeRefs(elProps.ref, (r) => (input = r))}
              disabled={disabled()}
              type={props.type}
              class={mergeClass(
                'font-size-inherit tp-border-none tp-py-inherit tp-px-inherit !tp-outline-transparent tp-bg-transparent tp-w-full tp-h-full tp-box-border tp-absolute tp-p-[inherit] tp-text-[var(--floating-fg)] tp-appearance-none tp-left-0 tp-top-0 tp-transition-opacity',
                !focused() &&
                  !hasContent() &&
                  (typeof props.label !== 'undefined' ||
                    !elProps.placeholder) &&
                  '!tp-opacity-0',
                elProps.class
              )}
              color={color()}
              onInput={mergeCallbacks(
                elProps.onInput,
                props.mask ? createInputMask(props.mask) : undefined,
                (event) => {
                  const ref = event.currentTarget || event.target;
                  const fieldValue =
                    props.type === 'number' ? parseFloat(ref.value) : ref.value;
                  if (props.onChange) {
                    props.onChange(fieldValue as FieldValue, event);
                  }

                  setValue(fieldValue as any);
                  // eslint-disable-next-line no-self-assign
                  ref.value = ref.value;
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

export default Input;
