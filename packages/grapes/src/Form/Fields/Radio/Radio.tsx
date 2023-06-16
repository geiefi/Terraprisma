import { Component, JSX, Show, createMemo, createSignal, splitProps } from 'solid-js';

import { setupField } from '../_Shared/Setups/setupField';

import { FormValue } from '../../Types/FormValue';
import Label from '../_Shared/Label/Label';
import { FieldInternalWrapper } from '../_Shared';

import { FieldPropKeys, FieldProps } from '../_Shared/FieldProps';

import './Radio.scss';
import { ClickableSignalizer, Ripple } from '../../../General';
import { mergeCallbacks } from '../../../Helpers';

export interface RadioProps extends FieldProps, Omit<JSX.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: JSX.Element;
  helperText?: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';

  onChange?: (value: boolean, event: MouseEvent) => any;
  value?: boolean;
}

const Radio: Component<RadioProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    [...FieldPropKeys, 'label', 'helperText', 'color', 'size', 'onChange']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    valueSignal: [value, setValue],
    focusedSignal: [focused, setFocused],
    validate,
    hasErrors
  } = setupField<RadioProps, FormValue, boolean>(props, false);

  const color = createMemo(() => props.color || 'primary');

  return <FieldInternalWrapper
    name={props.name}
    class="radio-container"
    errors={errors}
    helperText={props.helperText}
    renderHelperText={
      (typeof props.validators !== 'undefined'
        && props.validators.length !== 0)
      || typeof props.helperText !== 'undefined'
    }
    isDisabled={disabled()}
  >
    <div
      class="radio"
      classList={{
        primary: color() === 'primary',
        secondary: color() === 'secondary',
        tertiary: color() === 'tertiary',

        small: props.size === 'small',
        medium: typeof props.size === 'undefined' || props.size === 'medium',
        large: props.size === 'large',

        checked: value() === true,
        disabled: disabled(),
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
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}

    >
      <ClickableSignalizer
        color={value() ? `var(--${color()})` : undefined}
        show={focused()}
      >
        <Ripple class="radio-internal" center>
          <input
            {...elProps}

            id={id()}
            type="radio"
            value={value() ? 'on' : 'off'}

            onBlur={mergeCallbacks<() => void>(
              // eslint-disable-next-line solid/reactivity
              elProps.onBlur as any,
              () => setFocused(false)
            )}

            onFocus={mergeCallbacks<() => void>(
              // eslint-disable-next-line solid/reactivity
              elProps.onFocus as any,
              () => setFocused(true)
            )}
          />
        </Ripple>
      </ClickableSignalizer>
    </div>

    <Show when={props.label}>
      <Label
        for={id()}
        hasErrors={hasErrors()}
      >{props.label}</Label>
    </Show>
  </FieldInternalWrapper>;
}

export default Radio;
