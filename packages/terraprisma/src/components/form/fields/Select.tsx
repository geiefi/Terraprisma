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
  extendPropsFrom,
  componentBuilder,
  Dropdown,
  List,
  ListItem,
  GrowFade,
  Icons,
  Accents,
  addAccentColoring
} from '../../..';

import {
  FormValue,
  FormFieldValue,
  FieldName,
  FieldProps,
  FieldPropKeys
} from '../types';
import { FormField, InputContainer, useField } from '../components';

export interface SelectProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >
> extends FieldProps<OwnerFormValue, FormFieldValue, Name> {
  label?: JSX.Element;

  onFieldValueChanges?: (newValue: FormFieldValue) => any;
  onFocus?: () => any;

  style?: JSX.CSSProperties;
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
}

export interface SelectOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> extends Omit<ComponentProps<typeof ListItem>, 'value' | 'children'> {
  value: AllowedValue;
  children: JSX.Element;
}

const Option: Component<SelectOptionProps> = (props) =>
  props as unknown as JSX.Element;

const SelectContext = createContext<{
  options: Accessor<SelectOptionProps[]>;
  setOptions: Setter<SelectOptionProps[]>;

  color: Accessor<Accents>;

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
const Select = componentBuilder<SelectProps>()
  .factory(addAccentColoring<SelectProps>())
  .factory(
    extendPropsFrom<SelectProps & { color?: Accents }, 'div'>([
      ...FieldPropKeys,
      'label',
      'helperText',
      'color',
      'children',
      'onFieldValueChanges',
      'style',
      'onFocus'
    ])
  )
  .create((props, color, elProps) => {
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
                dropdownRef,
                setDropdownRef,
                inputContainerRef
              }}
            >
              <InputContainer
                {...elProps}
                id={id()}
                size={props.size}
                style={props.style}
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
              </InputContainer>

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
  }) as {
  <OwnerFormValue extends FormValue>(
    props: SelectProps<OwnerFormValue> &
      Omit<ComponentProps<'div'>, keyof SelectProps>
  ): JSX.Element;
  Option: typeof Option;
  Dropdown(
    props: Omit<ComponentProps<typeof Dropdown>, 'for'> & {
      style?: JSX.CSSProperties;
    }
  ): JSX.Element;
};

Select.Dropdown = (props) => {
  const {
    focusedS: [focused, setFocused],
    valueS: [value, setValue]
  } = useField();

  const { options, color, setDropdownRef, setOptions, inputContainerRef } =
    useContext(SelectContext)!; // TODO: throw clear and concise error here

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
    <Dropdown
      align="right"
      visible={focused()}
      tabindex="0"
      {...props}
      for={inputContainerRef()!}
      ref={mergeRefs(props.ref, setDropdownRef)}
      class={mergeClass('flex flex-col gap-2 max-h-[10rem]', props.class)}
      style={{
        '--color': `var(--${color()}-bg)`,
        '--hover-10': `var(--${color()}-hover-10)`,
        ...props.style
      }}
    >
      <List>
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
                  'relative flex items-center align-middle gap-3 cursor-pointer',
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
  );
};

Select.Option = Option;

export default Select;
