import { Component, createMemo, children as accessChildren, JSX, on, ParentProps, createEffect, For, Show } from "solid-js";
import Button, { ButtonProps } from "../../../General/Button/Button";
import { FieldValue } from "../../FormContext";
import FieldInternalWrapper from "../_Shared/FieldInternalWrapper/FieldInternalWrapper";

import { FieldProps, setupField } from "../_Shared/Utilts";

import "./ButtonChooser.scss";

export interface ButtonChooserProps extends FieldProps, ParentProps {
  label?: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  helperText?: JSX.Element;

  class?: string;
  classList?: Record<string, boolean | undefined>;
  style?: JSX.CSSProperties;

  onChange?: (newValue: FieldValue) => any;
}

export interface OptionProps extends ParentProps, ButtonProps {
  value: string;
}

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const ButtonChooser = (props: ButtonChooserProps) => {
  const {
    elementId: id,
    errorsStore: [errors, _setErrors],
    disabledSignal: [disabled, _setDisabled],
    valueSignal: [value, setValue],
    validate,
  } = setupField(props);

  const getChildren = accessChildren(() => props.children);
  const options = createMemo<OptionProps[]>(() => {
    let childrenArr: (JSX.Element | OptionProps)[];

    const children = getChildren();
    if (Array.isArray(children)) {
      childrenArr = children;
    } else {
      childrenArr = [children];
    }

    return childrenArr.filter(child => {
      return child !== null
        && typeof child === 'object'
        && Object.hasOwn(child, 'value')
        && Object.hasOwn(child, 'children');
    }) as OptionProps[];
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

  const color = createMemo(() => props.color || 'primary');

  return <FieldInternalWrapper
    id={id()}
    isDisabled={disabled()}
    errors={errors}
    name={props.name}
    renderHelperText={
      (typeof props.validators !== 'undefined' 
        && props.validators.length !== 0) 
      || typeof props.helperText !== 'undefined'
    }
    helperText={props.helperText}
    class={'button-chooser ' + (props.class || '')}
    classList={props.classList}
    style={{
      height: 'fit-content',
      ...props.style
    }}
  >
    <label for={id()} class="label">{props.label}</label>

    <div class="buttons">
      <For each={options()}>{(opt) => (
        <Button.Empty
          color={color()}
          disabled={disabled()}
          {...opt}
          classList={{
            'active': opt.value === value(),
            ...opt.classList
          }}
          onClick={(event) => {
            setValue(opt.value);

            if (opt.onClick) {
              opt.onClick(event);
            }
          }}
        >{opt.children}</Button.Empty>
      )}</For>
    </div>
  </FieldInternalWrapper>;
};

ButtonChooser.Option = Option;

export default ButtonChooser;
