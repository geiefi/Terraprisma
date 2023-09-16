import {
  Component,
  createMemo,
  children as accessChildren,
  JSX,
  on,
  createEffect,
  For,
  Show,
  ComponentProps
} from 'solid-js';

import {
  Label,
  FieldInternalWrapper,
  useField,
  setupFieldComponent,
  FieldName,
  FieldPropKeys,
  FieldProps
} from '../utils';

import { mergeClass } from '@terraprisma/utils';

import { Button, PossibleColors } from '@terraprisma/core';

import { FormFieldValue, FormValue } from '../../types';

import './ButtonChooser.scss';

export interface ButtonChooserProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >
> extends FieldProps<OwnerFormValue, FormFieldValue, Name> {
  label?: JSX.Element;
  color?: PossibleColors;
  helperText?: JSX.Element;

  style?: JSX.CSSProperties;

  onChange?: (newValue: FormFieldValue) => any;

  children:
    | JSX.Element
    | ((
        Option: Component<
          ButtonChooserOptionProps<
            FieldProps<OwnerFormValue, FormFieldValue, Name>['value']
          >
        >
      ) => JSX.Element);
}

export interface ButtonChooserOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> extends ComponentProps<typeof Button.Empty> {
  value: AllowedValue;
}

const Option: Component<ButtonChooserOptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const ButtonChooser = setupFieldComponent<ButtonChooserProps, 'div'>(
  (props, elProps) => {
    const {
      elementId: id,
      disabledS: [disabled],
      valueS: [value, setValue],
      validate,
      hasErrors
    } = useField()!;

    const getChildren = accessChildren(() =>
      typeof props.children === 'function'
        ? props.children(Option)
        : props.children
    );
    const options = createMemo<ButtonChooserOptionProps[]>(() => {
      let childrenArr: (JSX.Element | ButtonChooserOptionProps)[];

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
      }) as ButtonChooserOptionProps[];
    });

    createEffect(
      on(
        value,
        (newValue) => {
          validate(newValue);
        },
        { defer: true }
      )
    );

    const color = createMemo(() => props.color || 'accent');

    return (
      <FieldInternalWrapper
        {...elProps}
        class={mergeClass('button-chooser', elProps.class)}
        style={{
          height: 'fit-content',
          ...props.style
        }}
      >
        <Show when={props.label}>
          <Label for={id()} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        <div id={id()} class="buttons">
          <For each={options()}>
            {(opt) => (
              <Button.Empty
                disabled={disabled()}
                {...opt}
                color={color()}
                class={opt.class}
                classList={{
                  active: opt.value === value(),
                  ...opt.classList
                }}
                onClick={(event) => {
                  setValue(opt.value);

                  if (props.onChange) {
                    props.onChange(opt.value);
                  }

                  if (typeof opt.onClick === 'function') {
                    opt.onClick(event);
                  }
                }}
              >
                {opt.children}
              </Button.Empty>
            )}
          </For>
        </div>
      </FieldInternalWrapper>
    );
  },
  [
    ...FieldPropKeys,
    'label',
    'color',
    'children',
    'helperText',
    'onChange',
    'style'
  ]
) as {
  <OwnerFormValue extends FormValue>(
    props: ButtonChooserProps<OwnerFormValue> &
      Omit<ComponentProps<'div'>, keyof ButtonChooserProps>
  ): JSX.Element;
  Option(props: ButtonChooserOptionProps): JSX.Element;
};

ButtonChooser.Option = Option;

export default ButtonChooser;
