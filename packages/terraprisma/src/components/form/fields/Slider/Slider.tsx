import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  Show,
  splitProps
} from 'solid-js';
import { Portal, isServer } from 'solid-js/web';

import { FieldName, FieldPropKeys, FieldProps, FormValue } from '../../types';

import './Slider.css';
import { mergeRefs } from '@solid-primitives/refs';
import { Accents } from '../../../..';
import {
  mergeClass,
  mergeCallbacks
} from '../../../../utils';
import { createTooltip } from '../../../data-display';
import { GrowFade } from '../../../transitions';
import { FormField, Label } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';

export type SliderProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, number> = FieldName<
    OwnerFormValue,
    number
  >
> = LeftIntersection<
  FieldProps<OwnerFormValue, number, Name> & {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';
    color?: Accents;

    showTooltip?: boolean;
    renderTooltipContent?: (value: number) => JSX.Element;

    onChange?: (value: number) => void;
  },
  ComponentProps<'input'>
>;

const Slider = (allProps: SliderProps) => {
  const [props, elProps] = splitProps(allProps, [
    ...FieldPropKeys,
    'label',
    'helperText',
    'showTooltip',
    'renderTooltipContent',
    'color',
    'size',
    'onChange'
  ]);
  const color = () => props.color ?? 'accent';
  const step = () => parseFloat((elProps.step || 1).toString());
  const min = () => parseFloat((elProps.min || 0).toString());
  const max = () => parseFloat((elProps.max || 100).toString());

  return (
    <FormField fieldProperties={props} initialValue={min()}>
      {({
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate,
        hasErrors
        // eslint-disable-next-line solid/reactivity
      }) => {
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
          if (!isServer) {
            document.addEventListener('mousemove', handleMouseMove, {
              passive: true
            });
            document.addEventListener('mouseup', handleMouseUp);
          }

          onCleanup(() => {
            tempSlider.removeEventListener('mousedown', handleMouseDown);
            if (!isServer) {
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

        let input: HTMLInputElement;

        createEffect(() => {
          if (input) {
            input.value = (value() ?? '').toString();
          }
        });

        const size = () => props.size ?? 'medium';
        return (
          <>
            <Show when={props.label}>
              <Label for={id()} hasErrors={hasErrors()}>
                {props.label}
              </Label>
            </Show>

            <div
              class={mergeClass(
                'tp-w-full tp-h-min tp-py-1 tp-relative',
                'after:tp-absolute after:tp-left-[var(--value-percentage)] after:tp-top-1/2 after:-tp-translate-x-1/2 after:-tp-translate-y-1/2 after:tp-scale-150 after:tp-rounded-full after:tp-pointer-events-none after:tp-transition-opacity',
                focused() && 'after:tp-opacity-30',
                disabled()
                  ? 'tp-opacity-40 tp-bg-[var(--muted-fg)]'
                  : 'tp-cursor-pointer',
                size() === 'small' && 'after:tp-h-2 after:tp-w-2',
                size() === 'medium' && 'after:tp-h-4 after:tp-w-4',
                size() === 'large' && 'after:tp-h-5 after:tp-w-5'
              )}
              ref={slider}
              draggable={false}
              onKeyDown={handleKeyDown}
              style={{
                '--value-percentage': `${valuePercentageToMaxFromMin()}%`,
                '--color': `var(--${color()}-bg)`
              }}
            >
              <span
                class={mergeClass(
                  'tp-block tp-absolute tp-left-0 tp-top-1/2 -tp-translate-y-1/2 tp-w-[var(--value-percentage)] tp-bg-[var(--color)]',
                  size() === 'small' && 'tp-h-1 tp-rounded-[0.166rem]',
                  size() === 'medium' && 'tp-h-2 tp-rounded-[0.333rem]',
                  size() === 'large' && 'tp-h-2.5 tp-rounded-[0.416rem]'
                )}
                draggable={false}
              />
              <span
                // rail
                class={mergeClass(
                  'tp-block tp-w-full',
                  size() === 'small' && 'tp-h-1 tp-rounded-[0.083rem]',
                  size() === 'medium' && 'tp-h-2 tp-rounded-[0.166rem]',
                  size() === 'large' && 'tp-h-2.5 tp-rounded-[0.208rem]',
                  disabled() ? 'tp-bg-[var(--muted-fg)]' : 'tp-bg-[var(--deeper-bg)]'
                )}
                draggable={false}
              />
              <span
                // thumb
                class={mergeClass(
                  'tp-absolute tp-bg-[var(--color)] tp-left-[var(--value-percentage)] tp-top-1/2 tp-rounded-full -tp-translate-x-1/2 -tp-translate-y-1/2',
                  'tp-pointer-events-none tp-transition-opacity',
                  size() === 'small' && 'tp-h-2 tp-w-2',
                  size() === 'medium' && 'tp-h-4 tp-w-4',
                  size() === 'large' && 'tp-h-5 tp-w-5'
                )}
                ref={setAnchor}
                draggable={false}
              >
                <input
                  {...elProps}
                  ref={mergeRefs(elProps.ref, (ref) => (input = ref))}
                  class={mergeClass(
                    'slider-input tp-w-full tp-h-full tp-overflow-hidden tp-whitespace-nowrap tp-border-none tp-absolute tp-cursor-pointer',
                    elProps.class
                  )}
                  min={min()}
                  max={max()}
                  step={step()}
                  id={id()}
                  onFocus={mergeCallbacks(elProps.onFocus, () => {
                    setFocused(true);
                    setFocusedThroughKeyboard(true);
                  })}
                  onBlur={mergeCallbacks(elProps.onBlur, () => {
                    setFocused(false);
                    setFocusedThroughKeyboard(false);
                  })}
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
                    class="!tp-bg-[var(--color)] !tp-text-[var(--text-color)]"
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
          </>
        );
      }}
    </FormField>
  );
};

export default Slider;
