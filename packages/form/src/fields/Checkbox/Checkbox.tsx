import { JSX, Show, createEffect } from 'solid-js';

import {
  Label,
  FieldInternalWrapper,
  useField,
  setupFieldComponent,
  FieldName,
  FieldPropKeys,
  FieldProps
} from '../utils';

import {
  extendPropsFrom,
  makeComponent,
  mergeCallbacks
} from '@terraprisma/utils';

import { Check } from '@terraprisma/icons';
import { Accents, addAccentColoring } from '@terraprisma/core';

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
  size?: 'small' | 'medium' | 'large';

  onChange?: (
    value: boolean,
    event:
      | (MouseEvent & {
          currentTarget: HTMLDivElement;
          target: Element;
        })
      | (KeyboardEvent & {
          currentTarget: HTMLDivElement;
          target: Element;
        })
  ) => any;
}

const Checkbox = setupFieldComponent<boolean>().with(
  makeComponent(
    [
      addAccentColoring<CheckboxProps>(),
      extendPropsFrom<CheckboxProps & { color?: Accents }, 'input'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'color',
        'size',
        'onChange'
      ])
    ],
    (props, color, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        valueS: [value, setValue],
        focusedS: [focused, setFocused],
        validate,
        hasErrors
      } = useField<boolean>()!;

      const swapValue = (
        e:
          | (MouseEvent & {
              currentTarget: HTMLDivElement;
              target: Element;
            })
          | (KeyboardEvent & {
              currentTarget: HTMLDivElement;
              target: Element;
            })
      ) => {
        if (!disabled()) {
          const newValue = !value();
          setValue(newValue);
          validate(newValue);

          if (props.onChange) {
            props.onChange(newValue, e);
          }
        }
      };

      return (
        <FieldInternalWrapper>
          <div class="checkbox-container" onClick={swapValue}>
            <Show when={props.label}>
              <Label for={id()} hasErrors={hasErrors()}>
                {props.label}
              </Label>
            </Show>

            <div
              class="checkbox"
              style={{
                '--color': `var(--${color()}-bg)`,
                '--color-20': `var(--${color()}-bg-20)`,
                '--check-color': `var(--${color()}-fg)`
              }}
              classList={{
                small: props.size === 'small',
                medium:
                  typeof props.size === 'undefined' || props.size === 'medium',
                large: props.size === 'large',

                focused: focused(),
                checked: value() === true,
                disabled: disabled()
              }}
              onKeyUp={(e) => {
                if (e.key === 'space') {
                  swapValue(e);
                }
              }}
            >
              <input
                {...elProps}
                id={id()}
                type="checkbox"
                onBlur={mergeCallbacks(elProps.onBlur, () => setFocused(false))}
                onFocus={mergeCallbacks(elProps.onFocus, () =>
                  setFocused(true)
                )}
              />

              <Show when={value() === true}>
                <Check class="checked-icon" variant="rounded" />
              </Show>
            </div>
          </div>
        </FieldInternalWrapper>
      );
    }
  ),
  false
);

export default Checkbox;
