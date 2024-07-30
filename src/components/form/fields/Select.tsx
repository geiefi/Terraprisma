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
  Accessor,
  createSignal,
  createMemo
} from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';

import { mergeRefs } from '@solid-primitives/refs';

import {
  mergeClass,
  mergeEventHandlers,
  Popover,
  List,
  ListItem,
  GrowFade,
  Icons,
  Accents,
  createDismissListener,
  FieldRequiredProperties
} from '../../..';

import { FormFieldValue } from '../types';
import { InputLikeBase } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { createValueSignal } from './createValueSignal';

export type SelectProps = LeftIntersection<
  {
    label?: JSX.Element;

    onFocus?: () => any;
    onBlur?: (event?: FocusEvent) => any;

    color?: Accents;
    size?: 'small' | 'medium' | 'large';

    popover?: (props: ComponentProps<typeof Popover>) => JSX.Element;

    children: JSX.Element;
  } & FieldRequiredProperties,
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
    'label',
    'size',
    'color',
    'children',
    'disabled',
    'value',
    'isInvalid',
    'popover',
    'onInstantChange',
    'onFocus'
  ]);

  const [inputContainerRef, setInputContainerRef] =
    createSignal<HTMLDivElement>();

  const getChildren = accessChildren(
    () => props.children
  ) as Accessor<JSX.Element>;

  const options = createMemo(() => {
    let childrenArr: (JSX.Element | SelectOptionProps)[];

    let children = getChildren();

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

  const getOptionLabelFromValue = (value: FormFieldValue | undefined) => {
    return options().find((opt) => opt.value === value)?.children || '';
  };

  const [focused, setFocused] = createSignal(false);

  createEffect(
    on(
      focused,
      () => {
        if (props.onFocus && focused() === true) {
          props.onFocus();
        }

        if (focused() === false) {
          elProps.onBlur?.();
        }
      },
      { defer: true }
    )
  );

  const [value, setValue] = createValueSignal(() => props.value);

  return (
    <>
      <InputLikeBase
        {...elProps}
        size={props.size}
        class={mergeClass("flex items-center align-middle gap-3 cursor-pointer", elProps.class)}
        focused={focused()}
        tabindex="0"
        hasContent={value() !== undefined}
        onPointerDown={() => {
          !props.disabled && setFocused(true);
        }}
        onFocusIn={() => {
          !props.disabled && setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && focused()) {
            event.currentTarget.blur();
            setFocused(false);
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
        label={props.label}
        ref={mergeRefs(elProps.ref, setInputContainerRef)}
      >
        {getOptionLabelFromValue(value())}
      </InputLikeBase>

      <Portal>
        <GrowFade growingOrigin="top">
          <SelectDropdown
            onDismiss={() => setFocused(false)}
            visible={focused()}
            value={value()}
            onChange={(newValue) => {
              setValue(newValue);
              props.onInstantChange?.(newValue);
            }}
            anchor={inputContainerRef()!}
            options={options()}
            size={props.size ?? 'medium'}
            color={props.color ?? 'accent'}
            as={props.popover ?? Popover}
          />
        </GrowFade>
      </Portal>
    </>
  );
};

function SelectDropdown(props: {
  as: (props: ComponentProps<typeof Popover>) => JSX.Element;
  size: 'small' | 'medium' | 'large';
  color: Accents;
  anchor: HTMLDivElement;
  visible: boolean;
  onDismiss: () => any;
  options: SelectOptionProps[];

  value: FormFieldValue;
  onChange?: (newV: FormFieldValue) => void;
}) {
  const dismisser = createDismissListener({
    onDismiss: () => props.onDismiss(),
    nonDismissingElements: () => [props.anchor]
  });

  return (
    <Dynamic
      component={props.as}
      align="end"
      {...dismisser}
      visible={props.visible}
      for={props.anchor}
      ref={mergeRefs(dismisser.ref)}
      data-size={props.size}
      class={mergeClass(
        'flex flex-col max-h-[20rem]',
        'data-[size=small]:p-2.5 data-[size=medium]:p-3 data-[size=large]:p-3.5',
        'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-xl'
      )}
      style={{
        '--color': `var(--${props.color}-bg)`,
        '--hover-10': `var(--${props.color}-hover-10)`,
        width: `${props.anchor.getBoundingClientRect()?.width ?? 250}px`
      }}
    >
      <List size={props.size}>
        <For each={props.options}>
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
                  optionProps.value === props.value && 'justify-between',
                  optionElProps.class
                )}
                active={optionProps.value === props.value}
                onClick={mergeEventHandlers(optionElProps.onClick, () => {
                  props.onChange?.(optionProps.value);
                  props.onDismiss();
                })}
              >
                {optionElProps.children}

                <Show when={optionProps.value === props.value}>
                  <span class="my-auto text-center">
                    <Icons.Check variant="rounded" />
                  </span>
                </Show>
              </ListItem>
            );
          }}
        </For>
      </List>
    </Dynamic>
  );
}

Select.Option = Option;

export default Select;
