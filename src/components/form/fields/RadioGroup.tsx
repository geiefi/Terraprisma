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

import { mergeEventHandlers, mergeClass, Accents, Stack, FieldRequiredProperties } from '../../..';

import type { StackProps } from '../../layout/Stack';

import { FormFieldValue } from '../types';
import { Label } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { createValueSignal } from './createValueSignal';

export type RadioGroupOptionProps = LeftIntersection<
  {
    disabled?: boolean;
    value: FormFieldValue;

    size?: 'small' | 'medium' | 'large';
    color?: Accents;

    onClick?: (e: MouseEvent) => void;
  },
  ComponentProps<'input'>
>;

const RadioOption = (props: ComponentProps<typeof RadioInternal>) =>
  props as unknown as JSX.Element;

const RadioInternal = (allProps: RadioGroupOptionProps & {
  groupValue?: FormFieldValue;
  isInvalid?: boolean;
}) => {
  const [props, elProps] = splitProps(allProps, [
    'value',
    'groupValue',
    'children',
    'color',
    'disabled',
    'isInvalid',
    'size',
    'onClick'
  ]);
  const color = () => props.color ?? 'accent';

  const [isRadioFocused, setRadioToFocused] = createSignal(false);

  const isChecked = createMemo(() => props.value === props.groupValue);

  const size = createMemo(() => props.size ?? 'medium');

  return (
    <div
      class="flex flex-row items-center gap-2"
      onClick={(e) => {
        if (props.onClick && !props.disabled) {
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
          props.disabled
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
          type="radio"
          value={props.groupValue}
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
          for={elProps.id}
          class={mergeClass(
            'pointer-events-none',
            props.disabled && 'opacity-30'
          )}
          hasErrors={props.isInvalid}
        >
          {props.children}
        </Label>
      </Show>
    </div>
  );
};

export type RadioGroupProps = LeftIntersection<
  {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';
    radiosDirection?: StackProps['direction'];
    color?: Accents;

    onFocus?: () => any;

    children?:
      | JSX.Element
      | ((
          Option: Component<ComponentProps<typeof RadioOption>>
        ) => JSX.Element);
  } & FieldRequiredProperties,
  ComponentProps<typeof Stack>
>;

function RadioGroup(allProps: RadioGroupProps) {
  const [props, elProps] = splitProps(allProps, [
    'label',
    'radiosDirection',
    'color',
    'size',
    'onInstantChange',
    'value',
    'disabled',
    'isInvalid',
    'children'
  ]);
  const color = () => props.color ?? 'accent';
  const getChildren = accessChildren(() =>
    typeof props.children === 'function'
      ? props.children(RadioOption)
      : props.children
  );

  const [value, setValue] = createValueSignal(() => props.value);
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
        <Label for={elProps.id} hasErrors={props.isInvalid}>
          {props.label}
        </Label>
      </Show>

      <div {...elProps} class={mergeClass("flex gap-3", elProps.class)}>
        <For each={options()}>
          {(optionProps, i) => (
            <RadioInternal
              {...optionProps}
              tabindex={i()}
              disabled={optionProps.disabled || props.disabled}
              groupValue={value()}
              isInvalid={props.isInvalid}
              color={optionProps.color || color()}
              size={optionProps.size || props.size || 'medium'}
              onClick={mergeEventHandlers(optionProps.onClick, (e) => {
                if (!props.disabled) {
                  const newValue = optionProps.value;
                  setValue(newValue);

                  if (props.onInstantChange) {
                    props.onInstantChange(newValue, e);
                  }
                }
              })}
            />
          )}
        </For>
      </div>
    </>
  );
}

RadioGroup.Option = RadioOption;

export default RadioGroup;
