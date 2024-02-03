import { ComponentProps, JSX, Show, splitProps } from 'solid-js';
import {
  mergeCallbacks,
  mergeClass,
  Icons,
  Accents
} from '../../..';

import { FieldName, FieldPropKeys, FieldProps, FormValue } from '../types';
import { FormField, Label } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type CheckboxProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, boolean> = FieldName<
    OwnerFormValue,
    boolean
  >
> = LeftIntersection<
  FieldProps<OwnerFormValue, boolean, Name> & {
    label?: JSX.Element;
    helperText?: JSX.Element;
    color?: Accents;
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
  },
  ComponentProps<'input'>
>;

const Checkbox = (allProps: CheckboxProps) => {
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
        focusedS: [focused, setFocused],
        validate,
        hasErrors
      }) => {
        const toggleValue = (
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
          <div
            class="tp-flex tp-flex-row-reverse tp-justify-start tp-gap-2"
            onClick={toggleValue}
          >
            <Show when={props.label}>
              <Label for={id()} hasErrors={hasErrors()}>
                {props.label}
              </Label>
            </Show>

            <div
              class={mergeClass(
                'tp-relative tp-cursor-pointer tp-block tp-rounded-md tp-m-1 tp-p-0 tp-select-none tp-border-2 tp-border-solid tp-transition-colors',
                size() === 'small' && 'tp-w-4 tp-h-4',
                size() === 'medium' && 'tp-w-6 tp-h-6',
                size() === 'large' && 'tp-w-8 tp-h-8',
                value() === false && 'tp-bg-transparent',
                disabled()
                  ? [
                      'tp-opacity-30 tp-cursor-default',
                      value() === true && 'tp-bg-[var(--muted-bg)]'
                    ]
                  : [
                      'hover:tp-border-[var(--color)]',
                      value() === true && 'tp-bg-[var(--color)]',
                      focused()
                        ? 'tp-border-[var(--color)] tp-shadow-[0_0_4px_3px_var(--color-20)]'
                        : 'tp-shadow-[0_0_4px_3px_transparent]'
                    ]
              )}
              style={{
                '--color': `var(--${color()}-bg)`,
                '--color-20': `var(--${color()}-bg-20)`,
                '--check-color': `var(--${color()}-fg)`
              }}
              onKeyUp={(e) => {
                if (e.key === 'space') {
                  toggleValue(e);
                }
              }}
            >
              <input
                {...elProps}
                id={id()}
                type="checkbox"
                class={mergeClass(
                  'tp-left-0 tp-top-0 tp-w-full tp-h-full tp-opacity-0 tp-pointer-events-none',
                  elProps.class
                )}
                value={value() ? 'true' : 'false'}
                onBlur={mergeCallbacks(elProps.onBlur, () => setFocused(false))}
                onFocus={mergeCallbacks(elProps.onFocus, () =>
                  setFocused(true)
                )}
              />

              <Show when={value() === true}>
                <Icons.Check
                  style={{ scale: '1 !important' }}
                  class={mergeClass(
                    'tp-absolute tp-left-1/2 tp-top-1/2 tp-bg-transparent tp-font-bold tp-m-0 tp-pointer-events-none tp-select-none -tp-translate-x-1/2 -tp-translate-y-1/2',
                    disabled()
                      ? 'tp-text-[var(--muted-fg)]'
                      : 'tp-text-[var(--check-color)]',
                    size() === 'small' && 'tp-w-4 tp-h-4 tp-text-2xl',
                    size() === 'medium' && 'tp-w-6 tp-h-6 tp-text-4xl',
                    size() === 'large' && 'tp-w-8 tp-h-8 tp-text-6xl'
                  )}
                  variant="rounded"
                />
              </Show>
            </div>
          </div>
        );
      }}
    </FormField>
  );
};

export default Checkbox;
