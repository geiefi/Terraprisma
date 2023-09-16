import { JSX, Show, createMemo } from 'solid-js';

import { PossibleColors } from '@terraprisma/core';

import {
  FieldInternalWrapper,
  Label,
  FieldName,
  FieldPropKeys,
  FieldProps,
  useField,
  setupFieldComponent
} from '../utils';

import { FormValue } from '../../types';

import './Toggler.scss';

export interface TogglerProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, boolean> = FieldName<
    OwnerFormValue,
    boolean
  >
> extends FieldProps<OwnerFormValue, boolean, Name> {
  label?: JSX.Element;

  color?: PossibleColors;
  size?: 'small' | 'medium' | 'large';

  onChange?: (value: boolean, event: MouseEvent) => any;
}

const Toggler = setupFieldComponent<TogglerProps, 'input', boolean>(
  (props, elProps) => {
    const {
      elementId: id,

      disabledS: [disabled],
      valueS: [value, setValue],

      validate,
      hasErrors
    } = useField<boolean>()!;

    const color = createMemo(() => props.color || 'accent');

    return (
      <FieldInternalWrapper class="toggler-container">
        <Show when={props.label}>
          <Label for={id()} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        <div class="toggler">
          <input
            {...elProps}
            id={id()}
            type="checkbox"
            class={elProps.class}
            style={{
              '--on-color': `--${color()}-bg`
            }}
            classList={{
              on: value() === true,
              off: value() === false || typeof value() === 'undefined',

              disabled: disabled(),

              small: props.size === 'small',
              medium:
                props.size === 'medium' || typeof props.size === 'undefined',
              large: props.size === 'large',

              ...elProps.classList
            }}
            value={value() ? 'on' : 'off'}
            onClick={(event) => {
              if (!disabled()) {
                const newValue = !value();

                if (typeof props.onChange !== 'undefined') {
                  props.onChange(newValue, event);
                }

                setValue(newValue);
                validate(newValue);
              }
            }}
          />
        </div>
      </FieldInternalWrapper>
    );
  },
  [...FieldPropKeys, 'label', 'helperText', 'color', 'size', 'onChange'],
  false
);

export default Toggler;
