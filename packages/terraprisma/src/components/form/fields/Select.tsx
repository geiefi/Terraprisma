import {
  Component,
  children as accessChildren,
  JSX,
  For,
  createEffect,
  on,
  splitProps,
  ComponentProps,
  Show,
  createContext,
  Accessor,
  Setter,
  createSignal,
  useContext
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { mergeRefs } from '@solid-primitives/refs';

import {
  mergeClass,
  mergeCallbacks,
  Popover,
  List,
  ListItem,
  GrowFade,
  Icons,
  Accents
} from '../../..';

import {
  FormValue,
  FormFieldValue,
  FieldName,
  FieldProps,
  FieldPropKeys
} from '../types';
import { FormField, InputLikeBase, useField } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { combineStyle } from '@solid-primitives/props';

export type SelectProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >
> = LeftIntersection<
  FieldProps<OwnerFormValue, FormFieldValue, Name> & {
    label?: JSX.Element;

    onFieldValueChanges?: (newValue: FormFieldValue) => any;
    onFocus?: () => any;

    color?: Accents;
    size?: 'small' | 'medium' | 'large';

    children:
      | JSX.Element
      | ((
          Option: Component<
            SelectOptionProps<
              FieldProps<OwnerFormValue, FormFieldValue, Name>['value']
            >
          >
        ) => JSX.Element);
  },
  ComponentProps<'div'>
>;

export type SelectOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> = LeftIntersection<
  {
    value: AllowedValue;
    children: JSX.Element;
  },
  Omit<ComponentProps<typeof ListItem>, 'value' | 'children'>
>;

const Option: Component<SelectOptionProps> = (props) =>
  props as unknown as JSX.Element;

const SelectContext = createContext<{
  options: Accessor<SelectOptionProps[]>;
  setOptions: Setter<SelectOptionProps[]>;

  color: Accessor<Accents>;

  size: Accessor<'small' | 'medium' | 'large'>;

  dropdownRef: Accessor<HTMLDivElement | undefined>;
  setDropdownRef: Setter<HTMLDivElement | undefined>;

  inputContainerRef: Accessor<HTMLDivElement | undefined>;
}>();

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
 *   <Select.Dropdown>
 *     <Select.Option value='minecraft'>Minecraft</Select.Option>
 *     <Select.Option value='terraria'>Terraria</Select.Option>
 *     <Select.Option value='starbound'>Starbound</Select.Option>
 *     <Select.Option value='stardew-valley'>Stardew Valley</Select.Option>
 *   </Select.Dropdown>
 * </Select>
 * ```
 */
const Select = (allProps: SelectProps) => {
  const [props, elProps] = splitProps(allProps, [
    ...FieldPropKeys,
    'label',
    'helperText',
    'size',
    'color',
    'children',
    'onFieldValueChanges',
    'onFocus'
  ]);

  const color = () => props.color ?? 'accent';

  const [inputContainerRef, setInputContainerRef] =
    createSignal<HTMLDivElement>();
  const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();

  const [options, setOptions] = createSignal<SelectOptionProps[]>([]);

  const optionLabelFromValue = (value: FormFieldValue | undefined) => {
    return options().find((opt) => opt.value === value)?.children || '';
  };

  return (
    <FormField fieldProperties={props}>
      {({
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value],
        validate
      }) => {
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

        createEffect(
          on(value, (newValue) => {
            if (props.onFieldValueChanges) {
              props.onFieldValueChanges(newValue);
            }
          })
        );

        return (
          <SelectContext.Provider
            value={{
              options,
              color,
              setOptions,
              size: () => props.size ?? 'medium',
              dropdownRef,
              setDropdownRef,
              inputContainerRef
            }}
          >
            <InputLikeBase
              {...elProps}
              id={id()}
              size={props.size}
              labelFor={id()}
              class="flex items-center align-middle gap-3 cursor-pointer"
              label={props.label}
              tabindex="0"
              onFocus={() => !disabled() && setFocused(true)}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof HTMLElement) ||
                  (event.relatedTarget !== dropdownRef() &&
                    !dropdownRef()!.contains(event.relatedTarget))
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
              ref={mergeRefs(elProps.ref, setInputContainerRef)}
            >
              {optionLabelFromValue(value())}
            </InputLikeBase>

            <Portal>
              <GrowFade growingOrigin="top">
                {typeof props.children === 'function'
                  ? props.children(Option)
                  : props.children}
              </GrowFade>
            </Portal>
          </SelectContext.Provider>
        );
      }}
    </FormField>
  );
};

Select.Dropdown = (
  props: Omit<ComponentProps<typeof Popover>, 'for'> & {
    style?: JSX.CSSProperties;
  }
) => {
  const {
    focusedS: [focused, setFocused],
    valueS: [value, setValue]
  } = useField();

  const {
    options,
    color,
    size,
    setDropdownRef,
    setOptions,
    inputContainerRef
  } = useContext(SelectContext)!; // TODO: throw clear and concise error here

  const getChildren = accessChildren(() => props.children);
  createEffect(() => {
    let childrenArr: (JSX.Element | SelectOptionProps)[];

    const children = getChildren();
    if (Array.isArray(children)) {
      childrenArr = children;
    } else {
      childrenArr = [children];
    }

    setOptions(
      childrenArr.filter((child) => {
        return (
          child !== null &&
          typeof child === 'object' &&
          Object.hasOwn(child, 'value') &&
          Object.hasOwn(child, 'children')
        );
      }) as SelectOptionProps[]
    );
  });

  return (
    <Popover
      align="end"
      visible={focused()}
      tabindex="0"
      {...props}
      for={inputContainerRef()!}
      ref={mergeRefs(props.ref, setDropdownRef)}
      data-size={size()}
      class={mergeClass(
        'flex flex-col max-h-[10rem]',
        'data-[size=small]:p-1 data-[size=medium]:p-2 data-[size=large]:p-3',
        'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-lg',
        props.class
      )}
      style={combineStyle({
        '--color': `var(--${color()}-bg)`,
        '--hover-10': `var(--${color()}-hover-10)`
      }, props.style)}
    >
      <List size={size()}>
        <For each={options()}>
          {(optionAllProps) => {
            const [optionProps, optionElProps] = splitProps(optionAllProps, [
              'value'
            ]);
            return (
              <ListItem
                {...optionElProps}
                clickable
                class={mergeClass(
                  'relative flex align-middle cursor-pointer',
                  optionProps.value === value() && 'justify-between',
                  optionElProps.class
                )}
                active={optionProps.value === value()}
                onClick={mergeCallbacks(optionElProps.onClick, () => {
                  setValue(optionProps.value);
                  setFocused(false);
                })}
              >
                {optionElProps.children}

                <Show when={optionProps.value === value()}>
                  <span class="my-auto text-center">
                    <Icons.Check variant="rounded" />
                  </span>
                </Show>
              </ListItem>
            );
          }}
        </For>
      </List>
    </Popover>
  );
};

Select.Option = Option;

export default Select;
