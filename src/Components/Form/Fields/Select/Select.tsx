import { Component, createMemo, children as accessChildren, createSignal, JSX, onCleanup, onMount, ParentProps, For, createEffect, on } from 'solid-js';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FormControl from '../_Shared/FormControl/FormControl';

import { FieldProps, setupCommunicationWithFormContext } from '../_Shared/Utilts';

import { FieldValue } from '../../FormContext';

import './Select.scss';

export interface SelectProps extends FieldProps {
  label?: JSX.Element;
  helperText?: JSX.Element;
  onChange?: (newValue: FieldValue) => any;
  children: JSX.Element[] | JSX.Element;
}

export interface OptionProps {
  value: FieldValue;
  children: JSX.Element;
};

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const Select = (props: SelectProps) => {
  const { form, value } = setupCommunicationWithFormContext(props);

  const id = createMemo(() => `select-${form.identification()}-${props.name}`);
  const hasContent = createMemo(() => (value() || '').toString().length > 0);

  const [focused, setFocused] = createSignal<boolean>(false);

  const [inputContainerRef, setInputContainerRef] = createSignal<HTMLDivElement>();

  const onDocumentClick = (event: MouseEvent) => {
    if (event.target !== inputContainerRef() && focused()) {
      setFocused(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', onDocumentClick);
  });

  onCleanup(() => {
    document.removeEventListener('click', onDocumentClick);
  });

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

  const optionLabelFromValue = (value: FieldValue | undefined) => {
    return options().find(opt => opt.value === value)?.children;
  };

  createEffect(on(focused, () => {
    form.validate(props.name);
  }));

  return <FormControl
    name={props.name}
    helperText={props.helperText}
  >
    <InputContainer
      id={id}
      label={props.label}
      focused={focused}
      hasContent={hasContent}
      onClick={() => setFocused(focused => !focused)}
      ref={setInputContainerRef}
    >
      {optionLabelFromValue(value())}

    </InputContainer>

    {focused() && <div 
      class='select-dropdown' 
      style={{
        '--input-container-left': `${inputContainerRef()?.offsetLeft}px`,
        '--input-container-top':  `${inputContainerRef()?.offsetTop}px`,
        '--input-container-width': `${inputContainerRef()?.clientWidth}px`,
        '--input-container-height': `${inputContainerRef()?.clientHeight}px`
      }}
    >
      <For each={options()}>{(opt) => (
        <div
          class='option'
          classList={{ 'active': opt.value === value() }}
          onClick={() => {
            if (props.onChange) {
              props.onChange(opt.value);
            }

            form.update(props.name, opt.value);
            setFocused(false);
          }}
        >
          {opt.children}
        </div>
      )}</For>
    </div>}
  </FormControl>;
};

Select.Option = Option;

export default Select;
