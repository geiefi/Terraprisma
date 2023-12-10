import { ComponentProps, JSX, createEffect } from 'solid-js';

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
  componentBuilder,
  addAccentColoring,
  extendPropsFrom,
  mergeClass,
  mergeCallbacks
} from '../../../../utils';
import { FormField, InputLikeBase } from '../../components';

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

export interface InputProps<
  Type extends InputType = InputType,
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, InputBaseValue<Type>> = FieldName<
    OwnerFormValue,
    InputBaseValue<Type>
  >
> extends MaskedFieldProps<OwnerFormValue, InputBaseValue<Type>, Name> {
  label?: JSX.Element;

  type?: Type;

  size?: 'small' | 'medium' | 'large';

  onChange?: (
    value: MaskedFieldProps<
      OwnerFormValue,
      InputBaseValue<Type>,
      Name
    >['value'],
    event?: InputOnChangeEvent
  ) => void;
}

export const RawInput =
  componentBuilder<InputProps>()
    .factory(addAccentColoring<InputProps>())
    .factory(
      extendPropsFrom<InputProps & { color?: Accents }, 'input'>([
        'mask',
        'label',
        'helperText',
        'type',
        'size',
        'color',
        'onChange',
        ...MaskedFieldPropsKeys
      ])
    )
    .create((props, color, elProps) => {
      return (
        <FormField fieldProperties={props}>{({
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

          return <InputLikeBase
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
                'font-size-inherit border-none py-inherit px-inherit !outline-transparent bg-transparent w-full h-full box-border absolute p-[inherit] text-[var(--floating-fg)] appearance-none left-0 top-0 transition-opacity',
                !focused() &&
                !hasContent() &&
                (typeof props.label !== 'undefined' ||
                  !elProps.placeholder) &&
                '!opacity-0',
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
                    props.onChange(fieldValue, event);
                  }

                  setValue(fieldValue);
                  // eslint-disable-next-line no-self-assign
                  ref.value = ref.value;
                }
              )}
              onFocus={mergeCallbacks(elProps.onFocus, () => setFocused(true))}
              onBlur={mergeCallbacks(elProps.onBlur, () => setFocused(false))}
            />
          </InputLikeBase>
        }}</FormField>
      );
    })

const Input = <Type extends InputType = undefined>(
  props: ComponentProps<typeof RawInput> & InputProps<Type>
) => <RawInput {...props} />;

export default Input;
