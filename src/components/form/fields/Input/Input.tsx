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
import { mergeClass, mergeEventHandlers } from '../../../../utils';
import { InputLikeBase } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';
import { Dynamic } from 'solid-js/web';

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

    inputLikeBase?: (
      props: ComponentProps<typeof InputLikeBase>
    ) => JSX.Element;

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
    'inputLikeBase',
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
        validate,
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
            input.value = value() ?? '';
          }
        });

        return (
          <Dynamic
            component={props.inputLikeBase ?? InputLikeBase}
            size={props.size}
            color={color()}
            labelFor={id()}
            label={props.label}
          >
            <input
              {...elProps}
              name={props.name}
              id={id()}
              ref={mergeRefs(elProps.ref, (r) => (input = r))}
              disabled={disabled()}
              type={props.type}
              class={mergeClass(
                'font-size-inherit border-none py-inherit px-inherit !outline-transparent autofil:!bg-transparent filter-none bg-transparent w-full h-full box-border absolute p-[inherit] text-[var(--floating-fg)] appearance-none left-0 top-0 transition-opacity',
                !focused() &&
                  !hasContent() &&
                  (typeof props.label !== 'undefined' ||
                    !elProps.placeholder) &&
                  '!opacity-0',
                elProps.class
              )}
              color={color()}
              onInput={mergeEventHandlers(
                elProps.onInput,
                props.mask ? createInputMask(props.mask) : undefined,
                (event) => {
                  const ref = event.currentTarget || event.target;
                  const fieldValue =
                    props.type === 'number'
                      ? parseFloat(ref.value.length === 0 ? '0' : ref.value)
                      : ref.value;
                  if (props.onChange) {
                    props.onChange(fieldValue as FieldValue, event);
                  }

                  setValue(fieldValue as any);
                  // eslint-disable-next-line no-self-assign
                  ref.value = ref.value;
                }
              )}
              onFocus={mergeEventHandlers(elProps.onFocus, () =>
                setFocused(true)
              )}
              onBlur={mergeEventHandlers(elProps.onBlur, () => {
                setFocused(false);
                validate(value());
              })}
            />
          </Dynamic>
        );
      }}
    </FormField>
  );
};

export default Input;
