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
            class="flex flex-row-reverse justify-start gap-2"
            onClick={toggleValue}
          >
            <Show when={props.label}>
              <Label for={id()} hasErrors={hasErrors()}>
                {props.label}
              </Label>
            </Show>

            <div
              class={mergeClass(
                'relative cursor-pointer block rounded-md m-1 p-0 select-none border-2 border-solid transition-colors',
                size() === 'small' && 'w-4 h-4',
                size() === 'medium' && 'w-6 h-6',
                size() === 'large' && 'w-8 h-8',
                value() === false && 'bg-transparent',
                disabled()
                  ? [
                      'opacity-30 cursor-default',
                      value() === true && 'bg-[var(--muted-bg)]'
                    ]
                  : [
                      'hover:border-[var(--color)]',
                      value() === true && 'bg-[var(--color)]',
                      focused()
                        ? 'border-[var(--color)] shadow-[0_0_4px_3px_var(--color-20)]'
                        : 'shadow-[0_0_4px_3px_transparent]'
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
                  'left-0 top-0 w-full h-full opacity-0 pointer-events-none',
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
                    'absolute left-1/2 top-1/2 bg-transparent font-bold m-0 pointer-events-none select-none -translate-x-1/2 -translate-y-1/2',
                    disabled()
                      ? 'text-[var(--muted-fg)]'
                      : 'text-[var(--check-color)]',
                    size() === 'small' && 'w-4 h-4 text-2xl',
                    size() === 'medium' && 'w-6 h-6 text-4xl',
                    size() === 'large' && 'w-8 h-8 text-6xl'
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
