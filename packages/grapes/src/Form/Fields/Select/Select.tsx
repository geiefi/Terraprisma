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
  on,
  Show,
} from 'solid-js';

import InputContainer from '../_Shared/InputContainer/InputContainer';
import FieldInternalWrapper from '../_Shared/FieldInternalWrapper/FieldInternalWrapper';
import { KeyboardArrowDown } from '../../../Icons';

import { FieldProps, setupField } from '../_Shared/Utilts';

import { FieldValue } from '../../FormContext';

import './Select.scss';
import { Dropdown } from '../../../General';

export interface SelectProps extends FieldProps, ParentProps {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';

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
  const {
    elementId: id,
    errorsStore: [errors, _setErrors],
    disabledSignal: [disabled, _setDisabled],
    focusedSignal: [focused, setFocused],
    valueSignal: [value, setValue],
    validate,
    hasContent,
  } = setupField(props);

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
    if (props.onFocused && focused() === true) {
      props.onFocused();
    }

    if (focused() === false) {
      validate(value());
    }
  }, { defer: true }));

  return <FieldInternalWrapper
    name={props.name}
    errors={errors}
    isDisabled={disabled()}
    style={{
      cursor: disabled() === false ? 'pointer' : 'default'
    }}
    helperText={props.helperText}
  >
    <InputContainer
      id={id()}
      label={props.label}
      focused={focused()}
      color={props.color}
      disabled={disabled()}
      onClick={() => {
        if (!disabled()) {
          setFocused(focused => !focused)
        }
      }}
      hasContent={hasContent()}
      ref={setInputContainerRef}
    >
      {optionLabelFromValue(value())}

      <KeyboardArrowDown
        variant='rounded'
        class='select-icon'
        classList={{
          'open': focused()
        }}
      />
    </InputContainer>

    <Dropdown
      for={inputContainerRef()!}
      class='select-dropdown'
      visible={focused()}
      classList={{
        'primary': props.color === 'primary' || typeof props.color === 'undefined',
        'secondary': props.color === 'secondary',
        'tertiary': props.color === 'tertiary'
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
    </Dropdown>
  </FieldInternalWrapper>;
};

Select.Option = Option;

export default Select;
