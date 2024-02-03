import {
  ComponentProps,
  For,
  children as accessChildren,
  JSX,
  Show,
  createMemo,
  createSignal,
  Component,
  splitProps
} from 'solid-js';

import {
  mergeCallbacks,
  mergeClass,
  Accents,
  Stack
} from '../../..';

import type { StackProps } from '../../layout/Stack';

import {
  FormValue,
  FormFieldValue,
  FieldName,
  FieldProps,
  FieldPropKeys
} from '../types';
import { FormField, Label, useField } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type RadioGroupOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> = LeftIntersection<
  {
    value: AllowedValue;

    size?: 'small' | 'medium' | 'large';
    color?: Accents;
    disabled?: boolean;

    onClick?: (e: MouseEvent) => void;
  },
  ComponentProps<'input'>
>;

const RadioOption = (props: ComponentProps<typeof RadioInternal>) =>
  props as unknown as JSX.Element;

const RadioInternal = (allProps: RadioGroupOptionProps) => {
  const [props, elProps] = splitProps(allProps, [
    'value',
    'children',
    'color',
    'disabled',
    'size',
    'onClick'
  ]);
  const color = () => props.color ?? 'accent';
  const {
    elementId: groupId,
    valueS: [groupValue],
    disabledS: [groupDisabled],

    hasErrors
  } = useField<string>()!;

  const id = createMemo(() => `${groupId()}-${props.value}`);

  const [isRadioFocused, setRadioToFocused] = createSignal(false);

  const isDisabled = createMemo(() => props.disabled || groupDisabled());
  const isChecked = createMemo(() => props.value === groupValue());

  const size = createMemo(() => props.size ?? 'medium');

  return (
    <div
      class="tp-flex tp-flex-row tp-items-center tp-gap-2"
      onClick={(e) => {
        if (props.onClick && !isDisabled()) {
          props.onClick(e);
        }
      }}
    >
      <div
        class={mergeClass(
          'tp-relative tp-block tp-appearance-none tp-m-0 tp-p-0 tp-rounded-full tp-bg-transparent tp-transition-colors tp-z-[2]',
          'tp-border-2 tp-border-solid',
          'after:tp-absolute after:tp-left-1/2 after:tp-top-1/2 after:tp-w-2/3 after:-tp-translate-x-1/2 after:-tp-translate-y-1/2 after:tp-h-2/3 after:tp-rounded-full tp-transition-opacity',
          isChecked() ? 'after:tp-opacity-100' : 'after:tp-opacity-0',
          isDisabled()
            ? 'tp-border-[var(--muted-bg)] after:tp-bg-[var(--muted-bg)]'
            : [
                'tp-cursor-pointer after:tp-bg-[var(--color)]',
                isChecked()
                  ? 'tp-border-[var(--color)]'
                  : 'tp-border-[var(--deeper-fg)]'
              ],
          size() === 'small' && '!tp-w-4 !tp-h-4',
          size() === 'medium' && '!tp-w-6 !tp-h-6',
          size() === 'large' && '!tp-w-8 !tp-h-8'
        )}
        style={{
          '--color': `var(--${color()}-bg)`
        }}
      >
        <input
          {...elProps}
          class={mergeClass('tp-appearance-none tp-opacity-0', elProps.class)}
          id={id()}
          type="radio"
          value={groupValue()}
          onFocus={mergeCallbacks(elProps.onFocus, () =>
            setRadioToFocused(true)
          )}
          onBlur={mergeCallbacks(elProps.onBlur, () =>
            setRadioToFocused(false)
          )}
        />
      </div>

      <Show when={props.children}>
        <Label
          for={id()}
          class={mergeClass(
            'tp-pointer-events-none',
            isDisabled() && 'tp-opacity-30'
          )}
          hasErrors={hasErrors()}
        >
          {props.children}
        </Label>
      </Show>
    </div>
  );
};

export type RadioGroupProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >,
  AllowedValue extends FieldProps<
    OwnerFormValue,
    FormFieldValue,
    Name
  >['value'] = FieldProps<OwnerFormValue, FormFieldValue, Name>['value']
> = LeftIntersection<
  FieldProps<OwnerFormValue, FormFieldValue, Name> & {
    label?: JSX.Element;
    helperText?: JSX.Element;

    size?: 'small' | 'medium' | 'large';
    radiosDirection?: StackProps['direction'];
    color?: Accents;

    onChange?: (value: AllowedValue, event: MouseEvent) => any;

    children?:
      | JSX.Element
      | ((
          Option: Component<ComponentProps<typeof RadioOption>>
        ) => JSX.Element);
  },
  ComponentProps<typeof Stack>
>;

function RadioGroup(allProps: RadioGroupProps) {
  const [props, elProps] = splitProps(allProps, [
    ...FieldPropKeys,
    'label',
    'radiosDirection',
    'helperText',
    'color',
    'size',
    'onChange',
    'children'
  ]);
  const color = () => props.color ?? 'accent';
  const getChildren = accessChildren(() =>
    typeof props.children === 'function'
      ? props.children(RadioOption)
      : props.children
  );

  return (
    <FormField fieldProperties={props}>
      {({
        elementId: id,

        disabledS: [disabled],
        valueS: [_value, setValue],

        hasErrors,

        validate
      }) => {
        const options = () => {
          let childrenArr: (JSX.Element | ComponentProps<typeof RadioOption>)[];

          const children = getChildren();
          if (Array.isArray(children)) {
            childrenArr = children;
          } else {
            childrenArr = [children];
          }

          return childrenArr.filter((child) => {
            return (
              child !== null &&
              typeof child === 'object' &&
              Object.hasOwn(child, 'value') &&
              Object.hasOwn(child, 'children')
            );
          }) as ComponentProps<typeof RadioOption>[];
        };
        return (
          <>
            <Show when={props.label}>
              <Label for={id()} hasErrors={hasErrors()}>
                {props.label}
              </Label>
            </Show>

            <Stack spacing={10} direction={props.radiosDirection} {...elProps}>
              <For each={options()}>
                {(optionProps, i) => (
                  <RadioInternal
                    {...optionProps}
                    tabindex={i()}
                    color={optionProps.color || color()}
                    size={optionProps.size || props.size || 'medium'}
                    onClick={mergeCallbacks(optionProps.onClick, (e) => {
                      if (!disabled()) {
                        const newValue = optionProps.value;
                        setValue(newValue);
                        validate(newValue);

                        if (props.onChange) {
                          props.onChange(newValue, e);
                        }
                      }
                    })}
                  />
                )}
              </For>
            </Stack>
          </>
        );
      }}
    </FormField>
  );
}

RadioGroup.Option = RadioOption;

export default RadioGroup;
