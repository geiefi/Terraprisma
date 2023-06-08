import { Component, createEffect, createMemo, createSignal, JSX, on, onCleanup, Show, splitProps } from 'solid-js';

import { FieldPropKeys, FieldProps, setupField } from '../_Shared/Utilts';

import { FieldInternalWrapper } from '../_Shared';

import './Slider.scss';
import { FormValue } from '../../FormContext';
import Label from '../_Shared/Label/Label';
import { Tooltip } from '../../../General';
import { GrowFade } from '../../../Transitions';

export interface SliderProps extends FieldProps, Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name' | 'value'> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';

  showTooltip?: boolean;
  renderTooltipContent?: (value: number) => JSX.Element;

  onChange?: (value: number) => void,
  onFocus?: () => void,
}

const Slider: Component<SliderProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    [...FieldPropKeys, 'label', 'helperText', 'color', 'showTooltip', 'renderTooltipContent', 'size', 'onChange', 'onFocus']
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
    if (disabled()) return;

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

  const color = createMemo(() => props.color || 'primary');

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
        disabled: disabled(),

        'has-label': typeof props.label !== 'undefined',

        small: props.size === 'small',
        medium: props.size === 'medium' || typeof props.size === 'undefined',
        large: props.size === 'large',

        primary: color() === 'primary',
        secondary: color() === 'secondary',
        tertiary: color() === 'tertiary'
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

    <Show when={typeof props.showTooltip === 'undefined' ? true : props.showTooltip}>
      <GrowFade>
        <Tooltip
          for={thumbBoundingBox()!}
          visible={focused()}
          style={{
            background: `var(--${color()})`,
            color: `var(--text-${color()})`
          }}
        >
          <Show when={props.renderTooltipContent} fallback={value()}>
             {props.renderTooltipContent!(value() || min())}
          </Show>
        </Tooltip>
      </GrowFade>
    </Show>
  </FieldInternalWrapper>;
};

export default Slider;
