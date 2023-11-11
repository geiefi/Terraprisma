import {
  ComponentProps,
  For,
  children as accessChildren,
  JSX,
  ParentProps,
  Show,
  createMemo,
  createSignal,
  Component
} from 'solid-js';

import {
  setupFieldComponent,
  FieldInternalWrapper,
  Label,
  useField
} from './utils';

import {
  extendPropsFrom,
  componentBuilder,
  mergeCallbacks,
  mergeClass,
  Accents,
  addAccentColoring,
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

export interface RadioGroupOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> extends ParentProps {
  value: AllowedValue;

  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;

  onClick?: (e: MouseEvent) => void;
}

const RadioOption = (props: ComponentProps<typeof RadioInternal>) =>
  props as unknown as JSX.Element;

const RadioInternal = componentBuilder<RadioGroupOptionProps>()
  .factory(addAccentColoring<RadioGroupOptionProps>())
  .factory(
    extendPropsFrom<RadioGroupOptionProps & { color?: Accents }, 'input'>([
      'value',
      'children',
      'color',
      'disabled',
      'size',
      'onClick'
    ])
  )
  .create((props, color, elProps) => {
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
  });

export interface RadioGroupProps<
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
> extends FieldProps<OwnerFormValue, FormFieldValue, Name> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  size?: 'small' | 'medium' | 'large';
  radiosDirection?: StackProps['direction'];

  onChange?: (value: AllowedValue, event: MouseEvent) => any;

  children?:
    | JSX.Element
    | ((Option: Component<ComponentProps<typeof RadioOption>>) => JSX.Element);
}

const RadioGroup = setupFieldComponent().with(
  componentBuilder<RadioGroupProps>()
    .factory(addAccentColoring<RadioGroupProps>())
    .factory(
      extendPropsFrom<RadioGroupProps & { color?: Accents }, 'div'>([
        ...FieldPropKeys,
        'label',
        'radiosDirection',
        'helperText',
        'color',
        'size',
        'onChange',
        'children'
      ])
    )
    .create((props, color, elProps) => {
      const {
        elementId: id,

        disabledS: [disabled],
        valueS: [_value, setValue],

        hasErrors,

        validate
      } = useField()!;

      const getChildren = accessChildren(() =>
        typeof props.children === 'function'
          ? props.children(RadioOption)
          : props.children
      );
      const options = createMemo<ComponentProps<typeof RadioOption>[]>(() => {
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
      });

      return (
        <FieldInternalWrapper
          {...elProps}
          class={mergeClass('radio-group', elProps.class)}
        >
          <Show when={props.label}>
            <Label for={id()} hasErrors={hasErrors()}>
              {props.label}
            </Label>
          </Show>

          <Stack spacing={10} direction={props.radiosDirection}>
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
        </FieldInternalWrapper>
      );
    })
);

export default RadioGroup;
