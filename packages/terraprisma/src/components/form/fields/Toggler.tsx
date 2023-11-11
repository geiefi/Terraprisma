import { JSX, Show, createMemo } from 'solid-js';
import { Accents } from '../../..';
import { componentBuilder, addAccentColoring, extendPropsFrom, mergeClass } from '../../../utils';
import { FieldInternalWrapper, Label } from '../components';
import { FormValue, FieldName, FieldProps, FieldPropKeys } from '../types';
import { useField } from './FieldContext';
import { setupFieldComponent } from './setupFieldComponent';

export interface TogglerProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, boolean> = FieldName<
    OwnerFormValue,
    boolean
  >
> extends FieldProps<OwnerFormValue, boolean, Name> {
  label?: JSX.Element;

  size?: 'small' | 'medium' | 'large';

  onChange?: (value: boolean, event: MouseEvent) => any;
}

const Toggler = setupFieldComponent<boolean>().with(
  componentBuilder<TogglerProps>()
    .factory(addAccentColoring<TogglerProps>())
    .factory(
      extendPropsFrom<TogglerProps & { color?: Accents }, 'input'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'color',
        'size',
        'onChange'
      ])
    )
    .create((props, color, elProps) => {
      const {
        elementId: id,

        disabledS: [disabled],
        valueS: [value, setValue],

        validate,
        hasErrors
      } = useField<boolean>()!;

      const size = createMemo(() => props.size ?? 'medium');

      return (
        <FieldInternalWrapper class="w-fit">
          <Show when={props.label}>
            <Label for={id()} hasErrors={hasErrors()}>
              {props.label}
            </Label>
          </Show>

          <div class="w-fit box-content">
            <input
              {...elProps}
              id={id()}
              type="checkbox"
              class={mergeClass(
                'appearance-none transition-colors relative',
                'after after:absolute after:top-1/2 after:rounded-full after:-translate-y-1/2 after:transition-all',
                size() === 'small' &&
                  'w-6 h-3 after:w-2.5 after:h-2.5 rounded-[0.75rem]',
                size() === 'medium' &&
                  'w-10 h-5 after:w-4 after:h-4 rounded-[1.3rem]',
                size() === 'large' &&
                  'w-16 h-8 after:w-6.5 after:h-6.5 rounded-[4.1rem]',

                value() === true
                  ? 'after:left-[calc(100%-0.25rem)] after:-translate-x-full'
                  : 'after:left-1',

                disabled()
                  ? 'cursor-default bg-[var(--muted-bg)] after:bg-[var(--muted-fg)] opacity-30'
                  : [
                      'cursor-pointer',
                      value() === true
                        ? 'bg-[var(--on-color)] after:bg-[var(--on-circle-color)]'
                        : 'bg-[var(--deeper-bg)] after:bg-[var(--normal-bg)]'
                    ],

                elProps.class
              )}
              disabled={disabled()}
              aria-disabled={disabled()}
              style={{
                '--on-color': `var(--${color()}-bg)`,
                '--on-circle-color': `var(--${color()}-fg)`
              }}
              classList={{
                on: value() === true,

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
    }),
  false
);

export default Toggler;
