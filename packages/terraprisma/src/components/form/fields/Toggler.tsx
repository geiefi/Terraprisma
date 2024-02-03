import { ComponentProps, JSX, Show, splitProps } from 'solid-js';
import { Accents } from '../../..';
import { mergeClass } from '../../../utils';
import { Label } from '../components';
import { FormValue, FieldName, FieldProps, FieldPropKeys } from '../types';
import { FormField } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type TogglerProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, boolean> = FieldName<
    OwnerFormValue,
    boolean
  >
> = LeftIntersection<
  FieldProps<OwnerFormValue, boolean, Name> & {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';
    color?: Accents;

    onChange?: (value: boolean, event: MouseEvent) => any;
  },
  ComponentProps<'input'>
>;

const Toggler = (allProps: TogglerProps) => {
  const [props, elProps] = splitProps(allProps, [
    ...FieldPropKeys,
    'label',
    'helperText',
    'color',
    'size',
    'onChange'
  ]);
  const color = () => props.color ?? 'accent';
  const size = () => props.size ?? 'medium';

  return (
    <FormField fieldProperties={props} initialValue={false}>
      {({
        elementId: id,

        disabledS: [disabled],
        valueS: [value, setValue],

        validate,
        hasErrors
      }) => (
        <>
          <Show when={props.label}>
            <Label for={id()} hasErrors={hasErrors()}>
              {props.label}
            </Label>
          </Show>

          <div class="tp-w-fit tp-box-content">
            <input
              {...elProps}
              id={id()}
              type="checkbox"
              class={mergeClass(
                'tp-appearance-none tp-transition-colors tp-relative',
                'tp-after after:tp-absolute after:tp-top-1/2 after:tp-rounded-full after:-tp-translate-y-1/2 after:tp-transition-all',
                size() === 'small' &&
                  'tp-w-6 tp-h-3 after:tp-w-2.5 after:tp-h-2.5 tp-rounded-[0.75rem]',
                size() === 'medium' &&
                  'tp-w-10 tp-h-5 after:tp-w-4 after:tp-h-4 tp-rounded-[1.3rem]',
                size() === 'large' &&
                  'tp-w-16 tp-h-8 after:tp-w-6.5 after:tp-h-6.5 tp-rounded-[4.1rem]',

                value() === true
                  ? 'after:tp-left-[calc(100%-0.25rem)] after:-tp-translate-x-full'
                  : 'after:tp-left-1',

                disabled()
                  ? 'tp-cursor-default tp-bg-[var(--muted-bg)] after:tp-bg-[var(--muted-fg)] tp-opacity-30'
                  : [
                      'tp-cursor-pointer',
                      value() === true
                        ? 'tp-bg-[var(--on-color)] after:tp-bg-[var(--on-circle-color)]'
                        : 'tp-bg-[var(--deeper-bg)] after:tp-bg-[var(--normal-bg)]'
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
        </>
      )}
    </FormField>
  );
};

export default Toggler;
