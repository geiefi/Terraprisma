import { JSX, createEffect } from 'solid-js';

import { createInputMask } from '@solid-primitives/input-mask';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

import { mergeClass } from '../../../_Shared/Utils';

import { MaskedFieldPropsKeys, MaskedFieldProps } from '../_Shared/Types/MaskedFieldProps';

import './Input.scss';
import { forwardNativeElementProps } from '../../../Helpers';
import { mergeCallbacks } from '../../../Helpers';
import { useField } from '../_Shared/FieldHelpers/FieldContext';
import { setupFieldComponent } from '../_Shared/FieldHelpers/setupFieldComponent';
import { Key } from '../../../_Shared/Types/Key';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps<FormFieldKeys extends Key> extends MaskedFieldProps<FormFieldKeys> {
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (value: string, event?: InputOnChangeEvent) => void;
}

const Input = setupFieldComponent(
  forwardNativeElementProps<InputProps<string>, HTMLInputElement, JSX.InputHTMLAttributes<HTMLInputElement>>(
    (props, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        focusedS: [_focused, setFocused],
        valueS: [value, setValue],
        validate,
      } = useField()!;

      createEffect(() => {
        if (props.mask && typeof elProps.type !== 'undefined' && elProps.type === 'number') {
          throw new Error(`Error with Input named ${props.name}: Cannot have a mask on a number input!`);
        }
      });

      return (
        <FieldInternalWrapper>
          <InputContainer
            labelFor={id()}
            color={props.color}
            label={props.label}
          >
            <input
              {...elProps}
              id={id()}
              disabled={disabled()}
              class={mergeClass('input', elProps.class)}
              classList={{
                'no-label': typeof props.label === 'undefined',
              }}
              value={(value() || '') as string}
              onInput={mergeCallbacks(
                elProps.onInput as any, 
                props.mask ? createInputMask(props.mask) : undefined,
                (event: InputEvent & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
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
    ['mask', 'label', 'helperText', 'color', 'onChange', ...MaskedFieldPropsKeys]
  )
);

export default Input;