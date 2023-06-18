import { JSX } from 'solid-js';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';

import { FieldPropKeys, FieldProps } from '../_Shared/FieldProps';

import './TextArea.scss';
import { useField } from '../_Shared/FieldHelpers/FieldContext';
import { forwardNativeElementProps } from '../../../Helpers/forwardElementProps';
import { mergeCallbacks } from '../../../Helpers';
import { setupFieldComponent } from '../_Shared/FieldHelpers/setupFieldComponent';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextAreaProps extends FieldProps {
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

  onChange?: (newValue: string, event?: TextAreaChangeEvent) => any;
}

const TextArea = setupFieldComponent(
  forwardNativeElementProps<TextAreaProps, HTMLTextAreaElement, JSX.InputHTMLAttributes<HTMLTextAreaElement>>(
    (props, elProps) => {
      const {
        elementId: id,

        disabledS: [disabled],
        valueS: [value, setValue],
        hasContent,

        focusedS: [focused, setFocused],
        validate,
        hasErrors,
      } = useField<string>()!;

      return (
        <FieldInternalWrapper>
          <InputContainer
            labelFor={id()}
            hasErrors={hasErrors()}
            hasContent={hasContent()}
            focused={focused()}
            disabled={disabled()}
            color={props.color}
            label={props.label}
          >
            <textarea
              {...elProps}
              id={id()}
              value={(value() || '').toString()}
              disabled={disabled()}
              class={elProps.class}
              classList={{
                'no-label': typeof props.label === 'undefined',
                ...elProps.classList,
              }}
              onInput={(event) => {
                event.target.style.height = '0px';
                const scrollHeight = Math.max(event.target.scrollHeight, 54);
                event.target.style.height = `${scrollHeight}px`;

                event.target.parentElement!.style.height = `${scrollHeight}px`;

                if (props.onChange) {
                  props.onChange(event.currentTarget.value, event);
                }

                setValue(event.currentTarget.value);
              }}
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
    [...FieldPropKeys, 'label', 'helperText', 'color', 'onChange']
  )
);

export default TextArea;
