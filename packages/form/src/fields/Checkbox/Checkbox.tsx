import { JSX, Show, createMemo } from 'solid-js';

import {
  Label,
  FieldInternalWrapper,
  useField,
  setupFieldComponent,
  FieldName,
  FieldPropKeys,
  FieldProps
} from '../utils';

import { mergeCallbacks } from '@grapos/utils';

import { Check } from '@grapos/icons';
import { GrowFade } from '@grapos/transitions';
import { ClickableSignalizer, PossibleColors, Ripple } from '@grapos/core';

import { FormValue } from '../../types';

import './Checkbox.scss';

export interface CheckboxProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, boolean> = FieldName<
    OwnerFormValue,
    boolean
  >
> extends FieldProps<OwnerFormValue, boolean, Name> {
  label?: JSX.Element;
  helperText?: JSX.Element;
  color?: PossibleColors;
  size?: 'small' | 'medium' | 'large';

  onChange?: (value: boolean, event: MouseEvent) => any;
}

const Checkbox = setupFieldComponent<CheckboxProps, 'input', boolean>(
  (props, elProps) => {
    const {
      elementId: id,
      disabledS: [disabled],
      valueS: [value, setValue],
      focusedS: [focused, setFocused],
      validate,
      hasErrors
    } = useField<boolean>()!;

    const color = createMemo(() => props.color || 'accent');

    return (
      <FieldInternalWrapper>
        <Show when={props.label}>
          <Label for={id()} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        <div
          class="checkbox"
          style={{
            '--color': `var(--${color()}-bg)`,
            '--check-color': `var(--${color()}-fg)`
          }}
          classList={{
            small: props.size === 'small',
            medium:
              typeof props.size === 'undefined' || props.size === 'medium',
            large: props.size === 'large',

            checked: value() === true,
            disabled: disabled()
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
            show={focused() && !disabled()}
            color={value() ? `var(--${color()}-bg)` : undefined}
            class="checkbox-internal"
          >
            <Ripple color={color()} center>
              <input
                {...elProps}
                id={id()}
                type="checkbox"
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
                value={value() ? 'on' : 'off'}
              />

              <GrowFade>
                <Show when={value() === true}>
                  <Check class="checked-icon" variant="rounded" />
                </Show>
              </GrowFade>
            </Ripple>
          </ClickableSignalizer>
        </div>
      </FieldInternalWrapper>
    );
  },
  [...FieldPropKeys, 'label', 'helperText', 'color', 'size', 'onChange'],
  false
);

export default Checkbox;
