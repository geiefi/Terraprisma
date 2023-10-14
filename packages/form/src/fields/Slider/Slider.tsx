import {
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  Show
} from 'solid-js';
import { Portal } from 'solid-js/web';

import {
  canUseDocument,
  makeComponent,
  extendPropsFrom
} from '@terraprisma/utils';
import { createTooltip } from '@terraprisma/data-display';
import { Accents, addAccentColoring } from '@terraprisma/core';
import { GrowFade } from '@terraprisma/transitions';

import {
  FieldInternalWrapper,
  Label,
  FieldProps,
  FieldPropKeys,
  FieldName,
  useField,
  setupFieldComponent
} from '../utils';

import { FormValue } from '../../types';

import './Slider.scss';

export interface SliderProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, number> = FieldName<
    OwnerFormValue,
    number
  >
> extends FieldProps<OwnerFormValue, number, Name> {
  label?: JSX.Element;

  size?: 'small' | 'medium' | 'large';

  showTooltip?: boolean;
  renderTooltipContent?: (value: number) => JSX.Element;

  onChange?: (value: number) => void;
}

const Slider = setupFieldComponent<number>().with(
  makeComponent(
    [
      addAccentColoring<SliderProps>(),
      extendPropsFrom<SliderProps & { color?: Accents }, 'input'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'showTooltip',
        'renderTooltipContent',
        'size',
        'onChange'
      ])
    ],
    (props, color, elProps) => {
      const step = createMemo(() => parseFloat((elProps.step || 1).toString()));
      const min = createMemo(() => parseFloat((elProps.min || 0).toString()));
      const max = createMemo(() => parseFloat((elProps.max || 100).toString()));

      const {
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate,
        hasErrors
        // eslint-disable-next-line solid/reactivity
      } = useField<number>()!;
      const [isFocusedThroughKeyboard, setFocusedThroughKeyboard] =
        createSignal(false);

      // eslint-disable-next-line prefer-const
      let slider: HTMLDivElement = undefined as any;

      const updateValueBasedOnMouseX = (mouseX: number) => {
        const mouseRelativeX = mouseX - slider.getBoundingClientRect().x;

        let newValue = Math.max(
          Math.min((mouseRelativeX / slider.clientWidth) * max(), max()),
          min()
        );
        newValue = Math.floor(newValue / step()) * step();
        setValue(newValue);

        if (props.onChange) {
          props.onChange(newValue);
        }

        return newValue;
      };

      const handleMouseDown = (e: MouseEvent) => {
        if (!slider.contains(e.target as HTMLElement) && slider !== e.target)
          return;
        if (disabled()) return;

        setFocused(true);
        updateValueBasedOnMouseX(e.x);
      };

      const handleMouseUp = (e: MouseEvent) => {
        if (focused()) {
          const newValue = updateValueBasedOnMouseX(e.x);
          setFocused(false);
          setFocusedThroughKeyboard(false); // set it to false in case it is true at this point
          validate(newValue);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (focused() && !isFocusedThroughKeyboard()) {
          updateValueBasedOnMouseX(e.x);
        }
      };

      createEffect(() => {
        const tempSlider = slider;
        tempSlider.addEventListener('mousedown', handleMouseDown, {
          passive: true
        });
        if (canUseDocument()) {
          document.addEventListener('mousemove', handleMouseMove, {
            passive: true
          });
          document.addEventListener('mouseup', handleMouseUp);
        }

        onCleanup(() => {
          tempSlider.removeEventListener('mousedown', handleMouseDown);
          if (canUseDocument()) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          }
        });
      });

      const { setAnchor, updateBoundingBox, Tooltip } = createTooltip(
        `${id()}-SliderValueTooltip`
      );

      const valuePercentageToMaxFromMin = createMemo(
        () => ((value() || min() - min()) / max()) * 100
      );

      createEffect(
        on(value, () => {
          updateBoundingBox();
        })
      );

      const handleKeyDown = (e: KeyboardEvent) => {
        if (value()) {
          const key = e.key.toLowerCase();
          console.log(key);
          const stepToMoveBy = step();
          const minVal = min();
          const maxVal = max();
          if (key === 'arrowleft' || key === 'arrowdown') {
            setValue((val) => {
              if (val! - stepToMoveBy >= minVal) {
                return val! - stepToMoveBy;
              } else {
                return val;
              }
            });
          } else if (key === 'arrowup' || key === 'arrowright') {
            setValue((val) => {
              if (val! + stepToMoveBy <= maxVal) {
                return val! + stepToMoveBy;
              } else {
                return val;
              }
            });
          }
        }
      };

      return (
        <FieldInternalWrapper>
          <Show when={props.label}>
            <Label for={id()} hasErrors={hasErrors()}>
              {props.label}
            </Label>
          </Show>

          <div
            class="slider"
            ref={slider}
            draggable={false}
            onKeyDown={handleKeyDown}
            classList={{
              focused: focused(),
              disabled: disabled(),

              'has-label': typeof props.label !== 'undefined',

              small: props.size === 'small',
              medium:
                props.size === 'medium' || typeof props.size === 'undefined',
              large: props.size === 'large'
            }}
            style={{
              '--value-percentage': `${valuePercentageToMaxFromMin()}%`,
              '--color': `var(--${color()}-bg)`
            }}
          >
            <span class="trunk" draggable={false} />
            <span class="rail" draggable={false} />
            <span class="thumb" ref={setAnchor} draggable={false}>
              <input
                {...elProps}
                min={min()}
                max={max()}
                step={step()}
                id={id()}
                value={(value() || '').toString()}
                onFocus={() => {
                  setFocused(true);
                  setFocusedThroughKeyboard(true);
                }}
                onBlur={() => {
                  setFocused(false);
                  setFocusedThroughKeyboard(false);
                }}
                type="range"
                disabled={disabled()}
              />
            </span>
          </div>

          <Show
            when={
              typeof props.showTooltip === 'undefined'
                ? true
                : props.showTooltip
            }
          >
            <Portal>
              <GrowFade growingOrigin="bottom">
                <Tooltip
                  visible={focused()}
                  class="slider-value-tooltip"
                  style={{
                    '--color': `var(--${color()}-bg)`,
                    '--text-color': `var(--${color()}-fg)`
                  }}
                >
                  <Show when={props.renderTooltipContent} fallback={value()}>
                    {props.renderTooltipContent!(value() || min())}
                  </Show>
                </Tooltip>
              </GrowFade>
            </Portal>
          </Show>
        </FieldInternalWrapper>
      );
    }
  ),
  // eslint-disable-next-line solid/reactivity
  (props) => parseFloat((props.min ?? 0).toString())
);

export default Slider;
