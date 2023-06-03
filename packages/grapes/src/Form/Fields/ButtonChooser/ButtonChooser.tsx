import { Component, createMemo, children as accessChildren, JSX, on, createEffect, For, Show, splitProps } from "solid-js";
import Button, { ButtonProps } from "../../../General/Button/Button";
import { mergeClass } from "../../../_Shared/Utils";
import { FieldValue } from "../../FormContext";
import FieldInternalWrapper from "../_Shared/FieldInternalWrapper/FieldInternalWrapper";

import { FieldPropKeys, FieldProps, setupField } from "../_Shared/Utilts";

import "./ButtonChooser.scss";

export interface ButtonChooserProps extends FieldProps, JSX.HTMLAttributes<HTMLDivElement> {
  label?: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  helperText?: JSX.Element;

  style?: JSX.CSSProperties;

  onChange?: (newValue: FieldValue) => any;
}

export interface OptionProps extends ButtonProps {
  value: string;
}

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const ButtonChooser = (allProps: ButtonChooserProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    [...FieldPropKeys, 'label', 'color', 'helperText', 'onChange']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    valueSignal: [value, setValue],
    validate,
  } = setupField(props);

  const getChildren = accessChildren(() => elProps.children);
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
    {...elProps}
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
    class={mergeClass('button-chooser', elProps.class)}
    style={{
      height: 'fit-content',
      ...elProps.style
    }}
  >
    <Show when={props.label}>
      <label for={id()} class="label">{props.label}</label>
    </Show>

    <div class="buttons">
      <For each={options()}>{(opt) => (
        <Button.Empty
          color={color()}
          disabled={disabled()}
          {...opt}
          class={opt.class}
          classList={{
            'active': opt.value === value(),
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
        >{opt.children}</Button.Empty>
      )}</For>
    </div>
  </FieldInternalWrapper>;
};

ButtonChooser.Option = Option;

export default ButtonChooser;
