import {
  ComponentProps,
  JSX,
  createEffect,
  createSignal,
  splitProps
} from 'solid-js';

import { mergeRefs } from '@solid-primitives/refs';

import './Input.css';
import {
  Accents,
  FieldRequiredProperties,
  FieldRequiredPropertyKeys
} from '../../../..';
import { mergeClass, mergeEventHandlers } from '../../../../utils';
import { InputLikeBase } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';
import { Dynamic } from 'solid-js/web';
import { createValueSignal } from '../createValueSignal';

export type InputOnChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'email'
  | 'password'
  | undefined;
export type InputBaseValue<Type extends InputType> = Type extends 'number'
  ? number
  : string;

export type InputProps<Type extends InputType> = LeftIntersection<
  {
    label?: JSX.Element;

    type?: Type;

    size?: 'small' | 'medium' | 'large';

    color?: Accents;

    inputLikeBase?: (
      props: ComponentProps<typeof InputLikeBase>
    ) => JSX.Element;
  } & FieldRequiredProperties<InputBaseValue<Type>>,
  ComponentProps<'input'>
>;

export const Input = <Type extends InputType = 'text'>(allProps: InputProps<Type>) => {
  const [props, elProps] = splitProps(allProps, [
    'label',
    'type',
    'size',
    'color',
    'onChange',
    'inputLikeBase',
    ...FieldRequiredPropertyKeys
  ]);

  const color = () => props.color ?? 'accent';

  const [value, setValue] = createValueSignal(props);
  const [focused, setFocused] = createSignal(false);

  let input: HTMLInputElement;

  createEffect(() => {
    if (input) {
      input.value = (value() ?? '').toString();
    }
  });

  const hasContent = () =>
    value() !== undefined && value()!.toString().length > 0;

  return (
    <Dynamic
      component={props.inputLikeBase ?? InputLikeBase}
      size={props.size}
      color={color()}
      hasContent={hasContent()}
      focused={focused()}
      hasErrors={props.isInvalid}
      label={props.label}
    >
      <input
        {...elProps}
        ref={mergeRefs(elProps.ref, (r) => (input = r))}
        disabled={props.disabled}
        type={props.type}
        class={mergeClass(
          'font-size-inherit border-none py-inherit px-inherit !outline-transparent autofil:!bg-transparent filter-none bg-transparent w-full h-full box-border absolute p-[inherit] text-[var(--floating-fg)] appearance-none left-0 top-0 transition-opacity',
          !focused() &&
            !hasContent() &&
            (typeof props.label !== 'undefined' || !elProps.placeholder) &&
            '!opacity-0',
          elProps.class
        )}
        color={color()}
        onInput={mergeEventHandlers(
          elProps.onInput,
          //props.mask ? createInputMask(props.mask) : undefined,
          (event) => {
            const ref = event.currentTarget || event.target;
            const fieldValue =
              props.type === 'number'
                ? parseFloat(ref.value.length === 0 ? '0' : ref.value)
                : ref.value;

            setValue(fieldValue as any);
            // eslint-disable-next-line no-self-assign
            ref.value = ref.value;
          }
        )}
        onFocus={mergeEventHandlers(elProps.onFocus, () => setFocused(true))}
        onBlur={mergeEventHandlers(elProps.onBlur, () => {
          setFocused(false);
        })}
      />
    </Dynamic>
  );
};

export default Input;
