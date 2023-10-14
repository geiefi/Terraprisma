import {
  Component,
  createMemo,
  children as accessChildren,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  For,
  createEffect,
  on,
  splitProps,
  ComponentProps,
  Show
} from 'solid-js';

import {
  mergeClass,
  mergeCallbacks,
  canUseDocument,
  extendPropsFrom,
  makeComponent
} from '@terraprisma/utils';

import {
  InputContainer,
  FieldInternalWrapper,
  FieldName,
  FieldPropKeys,
  FieldProps,
  useField,
  setupFieldComponent
} from '../utils';

import { Dropdown, List, ListItem } from '@terraprisma/core';
import { GrowFade } from '@terraprisma/transitions';
import { Check, KeyboardArrowDown } from '@terraprisma/icons';

import { FormValue, FormFieldValue } from '../../types';

import './Select.scss';
import { Accents, addAccentColoring } from '@terraprisma/core';
import { Portal } from 'solid-js/web';

export interface SelectProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >
> extends FieldProps<OwnerFormValue, FormFieldValue, Name> {
  label?: JSX.Element;

  onChange?: (newValue: FormFieldValue) => any;
  onFocus?: () => any;

  children:
    | JSX.Element
    | ((
        Option: Component<
          SelectOptionProps<
            FieldProps<OwnerFormValue, FormFieldValue, Name>['value']
          >
        >
      ) => JSX.Element);
}

export interface SelectOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> extends Omit<ComponentProps<typeof ListItem>, 'value' | 'children'> {
  value: AllowedValue;
  children: JSX.Element;
}

const Option: Component<SelectOptionProps> = (props) =>
  props as unknown as JSX.Element;

/**
 * @description The component to be able to select only one option among many such as choosing a state/county,
 * a payment type or any other thing you wish.
 *
 * The values of the options can be written using the `Select.Option` component which just returns the
 * props of the Option instead of rendering it. The `Select` is the one that renders it. All other children
 * of the Select *will be ignored*.
 *
 * @example
 * ```tsx
 * <Select
 *   name='bestGame'
 *   label='Which one is better?'
 *   helperText='OBS: choose Terraria :)'
 *   validators={[Validators.required]}
 * >
 *   <Select.Option value='minecraft'>Minecraft</Select.Option>
 *   <Select.Option value='terraria'>Terraria</Select.Option>
 *   <Select.Option value='starbound'>Starbound</Select.Option>
 *   <Select.Option value='stardew-valley'>Stardew Valley</Select.Option>
 * </Select>
 * ```
 */
const Select = setupFieldComponent().with(
  makeComponent(
    [
      addAccentColoring<SelectProps>(),
      extendPropsFrom<SelectProps & { color?: Accents }, 'div'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'color',
        'children',
        'onChange',
        'onFocus'
      ])
    ],
    (props, color, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate
      } = useField()!;

      const [inputContainerRef, setInputContainerRef] =
        createSignal<HTMLDivElement>();

      const onDocumentClick = (event: MouseEvent) => {
        if (event.target !== inputContainerRef() && focused()) {
          setFocused(false);
        }
      };

      onMount(() => {
        if (canUseDocument())
          document.addEventListener('click', onDocumentClick);
      });
      onCleanup(() => {
        if (canUseDocument())
          document.removeEventListener('click', onDocumentClick);
      });

      const getChildren = accessChildren(() =>
        typeof props.children === 'function'
          ? props.children(Option)
          : props.children
      );
      const options = createMemo<SelectOptionProps[]>(() => {
        let childrenArr: (JSX.Element | SelectOptionProps)[];

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
        }) as SelectOptionProps[];
      });

      const optionLabelFromValue = (value: FormFieldValue | undefined) => {
        return options().find((opt) => opt.value === value)?.children || '';
      };

      createEffect(
        on(
          focused,
          () => {
            if (props.onFocus && focused() === true) {
              props.onFocus();
            }

            if (focused() === false) {
              validate(value());
            }
          },
          { defer: true }
        )
      );

      return (
        <FieldInternalWrapper>
          <InputContainer
            {...elProps}
            id={id()}
            labelFor={id()}
            style={{ cursor: 'pointer' }}
            label={props.label}
            tabindex="0"
            onFocus={() => !disabled() && setFocused(true)}
            onBlur={() => !disabled() && setFocused(false)}
            icon={
              <KeyboardArrowDown
                variant="rounded"
                class="select-icon"
                classList={{
                  open: focused()
                }}
              />
            }
            ref={(ref) => {
              if (typeof elProps.ref === 'function') {
                elProps.ref(ref);
              }

              setInputContainerRef(ref);
            }}
          >
            {optionLabelFromValue(value())}
          </InputContainer>

          <Portal>
            <GrowFade growingOrigin="top">
              <Dropdown
                for={inputContainerRef()!}
                class="select-dropdown"
                visible={focused()}
                style={{
                  '--color': `var(--${color()}-bg)`,
                  '--hover-10': `var(--${color()}-hover-10)`
                }}
              >
                <List>
                  <For each={options()}>
                    {(optionAllProps) => {
                      const [optionProps, optionElProps] = splitProps(
                        optionAllProps,
                        ['value']
                      );
                      return (
                        <ListItem
                          {...optionElProps}
                          clickable
                          class={mergeClass('option', optionElProps.class)}
                          active={optionProps.value === value()}
                          onClick={mergeCallbacks(optionElProps.onClick, () => {
                            if (props.onChange) {
                              props.onChange(optionProps.value);
                            }

                            setValue(optionProps.value as any);
                            setFocused(false);
                          })}
                        >
                          {optionElProps.children}

                          <Show when={optionProps.value === value()}>
                            <span class="active-check">
                              <Check variant="rounded" />
                            </span>
                          </Show>
                        </ListItem>
                      );
                    }}
                  </For>
                </List>
              </Dropdown>
            </GrowFade>
          </Portal>
        </FieldInternalWrapper>
      );
    }
  )
) as {
  <OwnerFormValue extends FormValue>(
    props: SelectProps<OwnerFormValue> &
      Omit<ComponentProps<'div'>, keyof SelectProps>
  ): JSX.Element;
  Option(props: SelectOptionProps): JSX.Element;
};

Select.Option = Option;

export default Select;
