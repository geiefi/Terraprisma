import { Component, JSX, Show, splitProps } from 'solid-js';

import { setupField } from '../_Shared/Setups/setupField';

import { FormValue } from '../../Types/FormValue';
import Label from '../_Shared/Label/Label';
import { FieldInternalWrapper } from '../_Shared';

import { FieldPropKeys, FieldProps } from '../_Shared/FieldProps';

import './Checkbox.scss';
import { Check } from '../../../Icons';
import { GrowFade } from '../../../Transitions';

export interface CheckboxProps extends FieldProps, Omit<JSX.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: JSX.Element;
  helperText?: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';

  onChange?: (value: boolean, event: MouseEvent) => any;
  value?: boolean;
}

const Checkbox: Component<CheckboxProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    [...FieldPropKeys, 'label', 'helperText', 'color', 'size', 'onChange']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    valueSignal: [value, setValue],
    validate,
    hasErrors
  } = setupField<CheckboxProps, FormValue, boolean>(props, false);

  return <FieldInternalWrapper
    name={props.name}
    errors={errors}
    helperText={props.helperText}
    renderHelperText={
      (typeof props.validators !== 'undefined'
        && props.validators.length !== 0)
      || typeof props.helperText !== 'undefined'
    }
    isDisabled={disabled()}
  >
    <Show when={props.label}>
      <Label
        for={id()}
        hasErrors={hasErrors()}
      >{props.label}</Label>
    </Show>

    <div
      class="checkbox"
      classList={{
        primary: typeof props.color === 'undefined' || props.color === 'primary',
        secondary: props.color === 'secondary',
        tertiary: props.color === 'tertiary',

        small: props.size === 'small',
        medium: typeof props.size === 'undefined' || props.size === 'medium',
        large: props.size === 'large',
      }}
      onClick={(e) => {
        if (!disabled()) {
          const newValue = !value();
          setValue(newValue);
          validate(newValue);

          if (props.onChange) {
            props.onChange(newValue, e);
          }
        }
      }}
    >
      <input
        {...elProps}

        id={id()}
        type="checkbox"
        classList={{
          checked: value() === true,
          disabled: disabled(),

          ...elProps.classList
        }}

        value={value() ? 'on' : 'off'}
      />

      <GrowFade>
        <Show when={value() === true}>
          <Check class="checked-icon" variant="rounded" />
        </Show>
      </GrowFade>
    </div>
  </FieldInternalWrapper>;
}

export default Checkbox;
