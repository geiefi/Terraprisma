import {
  ComponentProps,
  For,
  children as accessChildren,
  JSX,
  ParentProps,
  Show,
  createMemo,
  createSignal,
  Component,
  createEffect
} from 'solid-js';

import {
  setupFieldComponent,
  FieldInternalWrapper,
  Label,
  FieldName,
  FieldProps,
  FieldPropKeys,
  useField
} from '../utils';

import {
  extendPropsFrom,
  makeComponent,
  mergeCallbacks,
  mergeClass
} from '@terraprisma/utils';

import { Accents, addAccentColoring } from '@terraprisma/core';
import { Stack } from '@terraprisma/layout';
import type { StackProps } from '@terraprisma/layout/Stack/Stack';

import { FormValue, FormFieldValue } from '../../types';

import './RadioGroup.scss';

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

const RadioInternal = makeComponent(
  [
    addAccentColoring<RadioGroupOptionProps>(),
    extendPropsFrom<RadioGroupOptionProps & { color?: Accents }, 'input'>([
      'value',
      'children',
      'color',
      'disabled',
      'size',
      'onClick'
    ])
  ],
  (props, color, elProps) => {
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

    return (
      <div
        class="radio-container"
        onClick={(e) => {
          if (props.onClick && !isDisabled()) {
            props.onClick(e);
          }
        }}
      >
        <div
          class="radio"
          style={{
            '--color': `var(--${color()}-bg)`
          }}
          classList={{
            small: props.size === 'small',
            medium: props.size === 'medium',
            large: props.size === 'large',

            focused: isRadioFocused() === true,

            checked: isChecked(),
            disabled: isDisabled()
          }}
        >
          <input
            {...elProps}
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
          <Label for={id()} hasErrors={hasErrors()}>
            {props.children}
          </Label>
        </Show>
      </div>
    );
  }
);

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
  makeComponent(
    [
      addAccentColoring<RadioGroupProps>(),
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
    ],
    (props, color, elProps) => {
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
    }
  )
);

export default RadioGroup;
