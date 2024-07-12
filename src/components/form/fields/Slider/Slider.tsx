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
import { Dynamic, Portal, isServer } from 'solid-js/web';

import { FieldName, FieldPropKeys, FormValue } from '../../types';

import './Slider.css';
import { mergeRefs } from '@solid-primitives/refs';
import { Accents } from '../../../..';
import {
  mergeClass,
  mergeEventHandlers
} from '../../../../utils';
import { createTooltip } from '../../../data-display';
import { GrowFade } from '../../../transitions';
import { Label } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';

export type SliderProps = LeftIntersection<
  {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';
    color?: Accents;

    track?: (props: ComponentProps<'span'>) => JSX.Element;
    range?: (props: ComponentProps<'span'>) => JSX.Element;
    thumb?: (props: ComponentProps<'span'>) => JSX.Element;

    showTooltip?: boolean;
    renderTooltipContent?: (value: number) => JSX.Element;

    onChange?: (value: number) => void;
  },
  ComponentProps<'input'>
>;

const Slider = (allProps: SliderProps) => {
  const [props, elProps] = splitProps(allProps, [
    'label',
    'showTooltip',
    'renderTooltipContent',
    'color',
    'size',
    'onChange',

    'range',
    'track',
    'thumb'
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
            if (props.showTooltip === true || typeof props.showTooltip === 'undefined') {
              updateBoundingBox();
            }
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
                'w-full h-min py-1 relative',
                'after:absolute after:left-[var(--value-percentage)] after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-150 after:rounded-full after:pointer-events-none after:transition-opacity',
                focused() && 'after:opacity-30',
                disabled()
                  ? 'opacity-40 bg-[var(--muted-fg)]'
                  : 'cursor-pointer',
                size() === 'small' && 'after:h-2 after:w-2',
                size() === 'medium' && 'after:h-4 after:w-4',
                size() === 'large' && 'after:h-5 after:w-5'
              )}
              ref={slider}
              draggable={false}
              onKeyDown={handleKeyDown}
              style={{
                '--value-percentage': `${valuePercentageToMaxFromMin()}%`,
                '--color': `var(--${color()}-bg)`
              }}
            >
              <Dynamic
                class={mergeClass(
                  'block absolute left-0 top-1/2 -translate-y-1/2 w-[var(--value-percentage)] bg-[var(--color)]',
                  size() === 'small' && 'h-1 rounded-[0.166rem]',
                  size() === 'medium' && 'h-2 rounded-[0.333rem]',
                  size() === 'large' && 'h-2.5 rounded-[0.416rem]'
                )}
                component={props.range ?? 'span'}
                draggable={false}
              />
              <Dynamic
                // track
                class={mergeClass(
                  'block w-full',
                  size() === 'small' && 'h-1 rounded-[0.083rem]',
                  size() === 'medium' && 'h-2 rounded-[0.166rem]',
                  size() === 'large' && 'h-2.5 rounded-[0.208rem]',
                  disabled() ? 'bg-[var(--muted-fg)]' : 'bg-[var(--deeper-bg)]'
                )}
                component={props.track ?? 'span'}
                draggable={false}
              />
              <Dynamic
                // thumb
                class={mergeClass(
                  'absolute bg-[var(--color)] left-[var(--value-percentage)] top-1/2 rounded-full -translate-x-1/2 -translate-y-1/2',
                  'pointer-events-none transition-opacity',
                  size() === 'small' && 'h-2 w-2',
                  size() === 'medium' && 'h-4 w-4',
                  size() === 'large' && 'h-5 w-5'
                )}
                ref={setAnchor}
                draggable={false}
                component={props.thumb ?? 'span'}
              >
                <input
                  {...elProps}
                  name={props.name}
                  ref={mergeRefs(elProps.ref, (ref) => (input = ref))}
                  class={mergeClass(
                    'slider-input w-full h-full overflow-hidden whitespace-nowrap border-none absolute cursor-pointer',
                    elProps.class
                  )}
                  min={min()}
                  max={max()}
                  step={step()}
                  id={id()}
                  onFocus={mergeEventHandlers(elProps.onFocus, () => {
                    setFocused(true);
                    setFocusedThroughKeyboard(true);
                  })}
                  onBlur={mergeEventHandlers(elProps.onBlur, () => {
                    setFocused(false);
                    setFocusedThroughKeyboard(false);
                  })}
                  type="range"
                  disabled={disabled()}
                />
              </Dynamic>
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
                    class="!bg-[var(--color)] !text-[var(--text-color)]"
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
