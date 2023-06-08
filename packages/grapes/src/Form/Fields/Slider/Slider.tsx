import { Component, createEffect, createMemo, createSignal, JSX, on, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { FieldPropKeys, FieldProps, setupField } from '../_Shared/Utilts';

import { FieldInternalWrapper } from '../_Shared';

import './Slider.scss';
import { FormValue } from '../../FormContext';
import Label from '../_Shared/Label/Label';
import { Tooltip } from '../../../General';

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

  const step = createMemo(() => parseFloat((elProps.step || 1).toString()));
  const min = createMemo(() => parseFloat((elProps.min || 0).toString()));
  const max = createMemo(() => parseFloat((elProps.min || 100).toString()));

  const {
    elementId: id,
    errorsStore: [errors],
    disabledSignal: [disabled],
    focusedSignal: [focused, setFocused],
    valueSignal: [value, setValue],
    validate,
    hasErrors,
  // eslint-disable-next-line solid/reactivity
  } = setupField<SliderProps, FormValue, number>(props, min());

  // eslint-disable-next-line prefer-const
  let slider: HTMLDivElement = undefined as any;

  const updateValueBasedOnMouseX = (mouseX: number) => {
    const mouseRelativeX = mouseX - slider.getBoundingClientRect().x;

    let newValue = Math.max(Math.min(mouseRelativeX / slider.clientWidth * max(), max()), min());
    newValue = Math.floor(newValue / step()) * step();
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

  createEffect(() => {
    const tempSlider = slider;
    tempSlider.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);

    onCleanup(() => {
      tempSlider.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    });
  });

  const [thumb, setThumb] = createSignal<HTMLSpanElement>();

  const [thumbBoundingBox, setThumbBoundingBox] = createSignal<DOMRect>();

  createEffect(on(
    value,
    () => {
      if (thumb()) {
        setThumbBoundingBox(thumb()?.getBoundingClientRect());
      }
    }
  ));

  const valuePercentageToMaxFromMin = createMemo(() => (value() || min() - min()) / max() * 100)

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
      class="slider"
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
        '--value-percentage': `${valuePercentageToMaxFromMin()}%`,
      }}
    >
      <span
        class="trunk"
        draggable={false}
      />
      <span
        class="rail"
        draggable={false}
      />
      <span
        class="thumb"
        ref={setThumb}
        draggable={false}
      >
        <input
          {...elProps}

          min={min()}
          max={max()}
          step={step()}

          id={id()}
          value={(value() || '').toString()}

          type="range"
          disabled={disabled()}
        />
      </span>
    </div>

    <Tooltip
      for={thumbBoundingBox()!}
      visible={focused()}
    >{value()}</Tooltip>
  </FieldInternalWrapper>;
};

export default Slider;
