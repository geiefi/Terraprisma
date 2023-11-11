import {
  Component,
  createMemo,
  children as accessChildren,
  JSX,
  For,
  createEffect,
  on,
  splitProps,
  ComponentProps,
  Show
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { mergeRefs } from '@solid-primitives/refs';

import {
  mergeClass,
  mergeCallbacks,
  extendPropsFrom,
  componentBuilder,
  Dropdown,
  List,
  ListItem,
  GrowFade,
  Icons,
  Accents,
  addAccentColoring,
  setupFieldComponent
} from '../../..';

import {
  FormValue,
  FormFieldValue,
  FieldName,
  FieldProps,
  FieldPropKeys
} from '../types';
import { FieldInternalWrapper, InputContainer } from '../components';
import { useField } from './FieldContext';

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

  style?: JSX.CSSProperties;

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
  componentBuilder<SelectProps>()
    .factory(addAccentColoring<SelectProps>())
    .factory(
      extendPropsFrom<SelectProps & { color?: Accents }, 'div'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'color',
        'children',
        'onChange',
        'style',
        'onFocus'
      ])
    )
    .create((props, color, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate
      } = useField()!;

      let inputContainerRef!: HTMLDivElement;
      let dropdownRef!: HTMLDivElement;

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
            style={props.style}
            labelFor={id()}
            class="flex items-center align-middle gap-3 cursor-pointer"
            label={props.label}
            tabindex="0"
            onFocus={() => !disabled() && setFocused(true)}
            onBlur={(event) => {
              if (
                !(event.relatedTarget instanceof HTMLElement) ||
                (event.relatedTarget !== dropdownRef &&
                  !dropdownRef.contains(event.relatedTarget))
              ) {
                // if the new focused element is not the dropdown, or not inside the dropdown
                !disabled() && setFocused(false);
              }
            }}
            icon={
              <Icons.KeyboardArrowDown
                variant="rounded"
                class={mergeClass(
                  'transition-transform origin-center',
                  focused() ? 'rotate-180' : 'rotate-0'
                )}
              />
            }
            ref={mergeRefs(elProps.ref, (ref) => (inputContainerRef = ref))}
          >
            {optionLabelFromValue(value())}
          </InputContainer>

          <Portal>
            <GrowFade growingOrigin="top">
              <Dropdown
                for={inputContainerRef}
                ref={(ref) => (dropdownRef = ref)}
                class="flex flex-col gap-2 max-h-[10rem]"
                tabindex="0"
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
                          class={mergeClass(
                            'relative flex items-center align-middle gap-3 cursor-pointer',
                            optionElProps.class
                          )}
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
                            <span class="absolute left-full top-1/2 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2">
                              <Icons.Check variant="rounded" />
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
    })
) as {
  <OwnerFormValue extends FormValue>(
    props: SelectProps<OwnerFormValue> &
      Omit<ComponentProps<'div'>, keyof SelectProps>
  ): JSX.Element;
  Option: typeof Option;
};

Select.Option = Option;

export default Select;
