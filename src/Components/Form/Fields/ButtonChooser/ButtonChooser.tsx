import { Component, createMemo, children as accessChildren, JSX, on, ParentProps, createEffect, For } from "solid-js";
import Button from "../../../General/Button/Button";
import { FieldValue } from "../../FormContext";

import FormControl from "../_Shared/FormControl/FormControl";
import { FieldProps, setupCommunicationWithFormContext, setupFieldsValueSignal } from "../_Shared/Utilts";

import "./ButtonChooser.scss";

export interface ButtonChooserProps extends FieldProps, ParentProps {
  label: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  helperText?: JSX.Element;

  onChange?: (newValue: FieldValue) => any;
}

export interface OptionProps extends ParentProps {
  value: string;
}

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const ButtonChooser = (props: ButtonChooserProps) => {
  const form = setupCommunicationWithFormContext(props);
  const [value, setValue] = setupFieldsValueSignal(props, form);

  const id = createMemo(() =>
    form
      ? `button-chooser-${form.identification()}-${props.name}`
      : `button-chooser-${props.name}`
  );

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

  createEffect(on(value, () => {
    if (form) {
      form.validate(props.name);
    }
  }));

  const color = createMemo(() => props.color || 'primary');

  return <div
    class="button-chooser"
    id={id()}
    classList={{
      'error': form?.hasErrors(props.name)
    }}
  >
    <span class="label">{props.label}</span>

    <div class="buttons">
      <For each={options()}>{(opt) => (
        <Button
          type="empty"
          color={color()}
          classList={{
            'active': opt.value === value()
          }}
          onClick={() => setValue(opt.value)}
        >{opt.children}</Button>
      )}</For>
    </div>

    {(props.helperText || form?.hasErrors(props.name))
      && <div class="helper-text">{
        form?.hasErrors(props.name)
          ? form.firstErrorFor(props.name)
          : props.helperText
      }</div>}
  </div>;
};

ButtonChooser.Option = Option;

export default ButtonChooser;
