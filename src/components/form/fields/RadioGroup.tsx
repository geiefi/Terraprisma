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
  mergeEventHandlers,
  mergeClass,
  Accents,
  Stack
} from '../../..';

import type { StackProps } from '../../layout/Stack';

import {
  FormValue,
  FormFieldValue,
  FieldName,
  FieldPropKeys
} from '../types';
import { Label } from '../components';
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
      class="flex flex-row items-center gap-2"
      onClick={(e) => {
        if (props.onClick && !isDisabled()) {
          props.onClick(e);
        }
      }}
    >
      <div
        class={mergeClass(
          'relative block appearance-none m-0 p-0 rounded-full bg-transparent transition-colors z-[2]',
          'border-2 border-solid',
          'after:absolute after:left-1/2 after:top-1/2 after:w-2/3 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2/3 after:rounded-full transition-opacity',
          isChecked() ? 'after:opacity-100' : 'after:opacity-0',
          isDisabled()
            ? 'border-[var(--muted-bg)] after:bg-[var(--muted-bg)]'
            : [
                'cursor-pointer after:bg-[var(--color)]',
                isChecked()
                  ? 'border-[var(--color)]'
                  : 'border-[var(--deeper-fg)]'
              ],
          size() === 'small' && '!w-4 !h-4',
          size() === 'medium' && '!w-6 !h-6',
          size() === 'large' && '!w-8 !h-8'
        )}
        style={{
          '--color': `var(--${color()}-bg)`
        }}
      >
        <input
          {...elProps}
          class={mergeClass('appearance-none opacity-0', elProps.class)}
          id={id()}
          type="radio"
          value={groupValue()}
          onFocus={mergeEventHandlers(elProps.onFocus, () =>
            setRadioToFocused(true)
          )}
          onBlur={mergeEventHandlers(elProps.onBlur, () =>
            setRadioToFocused(false)
          )}
        />
      </div>

      <Show when={props.children}>
        <Label
          for={id()}
          class={mergeClass(
            'pointer-events-none',
            isDisabled() && 'opacity-30'
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
                    onClick={mergeEventHandlers(optionProps.onClick, (e) => {
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
