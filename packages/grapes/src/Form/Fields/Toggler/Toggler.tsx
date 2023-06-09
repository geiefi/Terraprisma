import { Component, JSX, splitProps, Show } from 'solid-js';

import { setupField } from '../_Shared/Setups/setupField';

import { FieldInternalWrapper } from '../_Shared';
import Label from '../_Shared/Label/Label';

import { FormValue } from '../../Types/FormValue';

import { FieldPropKeys, FieldProps } from '../_Shared/FieldProps';

import './Toggler.scss';

export interface TogglerProps extends FieldProps, JSX.HTMLAttributes<HTMLInputElement> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
}

const Toggler: Component<TogglerProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    [...FieldPropKeys, 'label', 'helperText', 'color', 'size']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    valueSignal: [value, setValue],
    validate,
    hasErrors
  } = setupField<TogglerProps, FormValue, boolean>(props, false);

  return <FieldInternalWrapper
    name={props.name}
    errors={errors}
    helperText={props.helperText}
    renderHelperText={
      (typeof props.validators !== 'undefined'
        && props.validators.length !== 0)
      || typeof props.helperText !== 'undefined'
    }
    class="toggler-container"
    isDisabled={disabled()}
  >
    <Show when={props.label}>
      <Label
        for={id()}
        hasErrors={hasErrors()}
      >{props.label}</Label>
    </Show>

    <div class="toggler">
      <input
        {...elProps}

        id={id()}
        type="checkbox"
        class={elProps.class}
        classList={{
          on: value() === true,
          off: value() === false,

          disabled: disabled(),

          primary: props.color === 'primary' || typeof props.color === 'undefined',
          secondary: props.color === 'secondary',
          tertiary: props.color === 'tertiary',

          small: props.size === 'small',
          medium: props.size === 'medium' || typeof props.size === 'undefined',
          large: props.size === 'large',

          ...elProps.classList
        }}

        value={value() ? 'on' : 'off'}
        onClick={() => {
          if (!disabled()) {
            const newValue = !value();

            setValue(newValue);
            validate(newValue);
          }
        }}
      />
    </div>
  </FieldInternalWrapper>;
};

export default Toggler;
