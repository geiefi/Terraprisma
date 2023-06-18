import { JSX } from 'solid-js';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

import { mergeClass } from '../../../_Shared/Utils';

import { FieldPropKeys, FieldProps } from '../_Shared/FieldProps';

import './Input.scss';
import { forwardNativeElementProps } from '../../../Helpers/forwardElementProps';
import { mergeCallbacks } from '../../../Helpers';
import { useField } from '../_Shared/FieldHelpers/FieldContext';
import { setupFieldComponent } from '../_Shared/FieldHelpers/setupFieldComponent';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export interface InputProps extends FieldProps {
  type?: 'text' | 'number' | 'email' | 'password';

  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (value: string, event?: InputOnChangeEvent) => void;
}

const Input = setupFieldComponent(
  forwardNativeElementProps<InputProps, HTMLInputElement, JSX.InputHTMLAttributes<HTMLInputElement>>(
    (props, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate,
        hasContent,
        hasErrors,
      } = useField()!;

      return (
        <FieldInternalWrapper>
          <InputContainer
            labelFor={id()}
            hasErrors={hasErrors()}
            hasContent={hasContent()}
            focused={focused()}
            color={props.color}
            disabled={disabled()}
            label={props.label}
          >
            <input
              {...elProps}
              id={id()}
              value={(value() || '').toString()}
              type={props.type || 'text'}
              disabled={disabled()}
              class={mergeClass('input', elProps.class)}
              classList={{
                'no-label': typeof props.label === 'undefined',
              }}
              onInput={(event) => {
                if (typeof elProps.onInput === 'function') {
                  elProps.onInput(event);
                }
                if (props.onChange) {
                  props.onChange(event.currentTarget.value, event);
                }

                setValue(event.currentTarget.value);
              }}
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
    [...FieldPropKeys, 'type', 'label', 'helperText', 'color', 'onChange']
  )
);

export default Input;
