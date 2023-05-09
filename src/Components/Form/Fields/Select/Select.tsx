import {
  Component,
  createMemo,
  children as accessChildren,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  For,
  createEffect,
  ParentProps,
} from 'solid-js';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FormControl from '../_Shared/FormControl/FormControl';

import { FieldProps, setupCommunicationWithFormContext, setupFieldsValueSignal } from '../_Shared/Utilts';

import { FieldValue } from '../../FormContext';

import './Select.scss';

export interface SelectProps extends FieldProps, ParentProps {
  label?: JSX.Element;
  helperText?: JSX.Element;

  onChange?: (newValue: FieldValue) => any;
  onFocused?: () => any;
}

export interface OptionProps {
  value: FieldValue;
  children: JSX.Element;
};

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

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
 *   <Select.Option value='minecraft'>Minecraft</Select.Option>
 *   <Select.Option value='terraria'>Terraria</Select.Option>
 *   <Select.Option value='starbound'>Starbound</Select.Option>
 *   <Select.Option value='stardew-valley'>Stardew Valley</Select.Option>
 * </Select>
 * ```
 */
const Select = (props: SelectProps) => {
  const form = setupCommunicationWithFormContext(props);
  const [value, setValue] = setupFieldsValueSignal(props, form);

  const id = createMemo(() =>
    form
      ? `select-${form.identification()}-${props.name}`
      : `select-${props.name}`
  );
  const hasContent = createMemo(() =>
    (value() || '').toString().length > 0
  );

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

  createEffect(() => {
    if (props.onFocused && focused() === true) {
      props.onFocused();
    }

    if (form && focused() === false) {
      form.validate(props.name);
    }
  });

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
        '--input-container-top': `${inputContainerRef()?.offsetTop}px`,
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

            setValue(opt.value);
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
