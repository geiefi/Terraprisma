import { Component, JSX, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { FieldPropKeys, FieldProps, setupField } from '../_Shared/Utilts';

import { FieldInternalWrapper } from '../_Shared';

import './Slider.scss';
import { FormValue } from '../../FormContext';
import Label from '../_Shared/Label/Label';

export interface SliderProps extends FieldProps, Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name' | 'value'> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';

  onChange?: (value: number) => void,
  onFocus?: () => void,
}

const Slider: Component<SliderProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    [...FieldPropKeys, 'label', 'helperText', 'color', 'onChange', 'onFocus']
  );

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    focusedSignal: [focused, setFocused],
    valueSignal: [value, setValue],
    validate,
    hasErrors,
  } = setupField<SliderProps, FormValue, number>(props, 0);

  // eslint-disable-next-line prefer-const
  let slider: HTMLDivElement = undefined as any;

  const updateValueBasedOnMouseX = (mouseX: number) => {
    const mouseRelativeX = mouseX - slider.getBoundingClientRect().x;

    const newValue = Math.max(Math.min(mouseRelativeX / slider.clientWidth * 100, 100), 0);
    setValue(newValue);

    if (props.onChange) {
      props.onChange(newValue);
    }

    return newValue;
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!slider.contains(e.target as HTMLElement) && slider !== e.target) return;
    setFocused(true);
    updateValueBasedOnMouseX(e.x);
  };
  const handleMouseUp = (e: MouseEvent) => {
    if (focused()) {
      const newValue = updateValueBasedOnMouseX(e.x);
      setFocused(false);
      validate(newValue);
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (focused()) {
      updateValueBasedOnMouseX(e.x);
    }
  };
  onMount(() => {
    slider.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
  });

  onCleanup(() => {
    slider.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  });

  return <FieldInternalWrapper
    name={props.name}
    errors={errors}
    helperText={props.helperText}
    renderHelperText={
      (typeof props.validators !== 'undefined'
        && props.validators.length !== 0)
      || typeof props.helperText !== 'undefined'
    }
    isDisabled={disabled()}
  >
    <Show when={props.label}>
      <Label
        for={id()}
        hasErrors={hasErrors()}
      >{props.label}</Label>
    </Show>

    <div
      class='slider'
      ref={slider}
      draggable={false}
      classList={{
        focused: focused(),

        'has-label': typeof props.label !== 'undefined',

        primary: props.color === 'primary' || typeof props.color === 'undefined',
        secondary: props.color === 'secondary',
        tertiary: props.color === 'tertiary'
      }}
      style={{
        '--slider-value': `${value() || 0}%`,
      }}
    >
      <span
        class='trunk'
        draggable={false}
      />
      <span
        class='rail'
        draggable={false}
      />
      <span
        class='thumb'
        draggable={false}
      >
        <input
          min={0}
          max={100}
          step={1}

          {...elProps}

          id={id()}
          value={(value() || '').toString()}

          type='range'
          disabled={disabled()}
        />
      </span>
    </div>
  </FieldInternalWrapper>;
};

export default Slider;
