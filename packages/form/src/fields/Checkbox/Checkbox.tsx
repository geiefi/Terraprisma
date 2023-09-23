import { JSX, Show } from 'solid-js';

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
import { GrowFade } from '@terraprisma/transitions';
import { Ripple } from '@terraprisma/core';

import { FormValue } from '../../types';

import './Checkbox.scss';
import { Accents, addAccentColoring } from '@terraprisma/theming';

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

  onChange?: (value: boolean, event: MouseEvent) => any;
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
        focusedS: [, setFocused],
        validate,
        hasErrors
      } = useField<boolean>()!;

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
            {/* <ClickableSignalizer */}
            {/*   show={focused() && !disabled()} */}
            {/*   color={value() ? `var(--${color()}-bg)` : undefined} */}
            {/*   class="checkbox-internal" */}
            {/* > */}
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
            {/* </ClickableSignalizer> */}
          </div>
        </FieldInternalWrapper>
      );
    }
  ),
  false
);

export default Checkbox;
