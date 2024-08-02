import { ComponentProps, JSX, Show, createSignal, splitProps } from 'solid-js';
import { mergeEventHandlers, mergeClass, Icons, Accents, FieldRequiredProperties, FieldRequiredPropertyKeys } from '../../..';

import { Label } from '../components';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { createValueSignal } from './createValueSignal';

export type CheckboxProps = LeftIntersection<
  {
    label?: JSX.Element;

    color?: Accents;
    size?: 'small' | 'medium' | 'large';
    onChange?: (newValue: boolean) => any;
  } & FieldRequiredProperties<boolean>,
  ComponentProps<'input'>
>;

const Checkbox = (allProps: CheckboxProps) => {
  const [props, elProps] = splitProps(allProps, [
    'label',
    ...FieldRequiredPropertyKeys,
    'color',
    'size',
    'onChange',
  ]);

  const color = () => props.color ?? 'accent';

  const size = () => props.size ?? 'medium';

  const [value, setValue] = createValueSignal(props);

  const toggleValue = (
    e:
      | (MouseEvent & {
          currentTarget: HTMLDivElement;
          target: Element;
        })
      | (KeyboardEvent & {
          currentTarget: HTMLDivElement;
          target: Element;
        })
  ) => {
    if (!props.disabled) {
      const newValue = !value();
      setValue(newValue);

      props.onChange?.(newValue);
    }
  };

  const [focused, setFocused] = createSignal(false);

  return (
    <div
      class="flex flex-row-reverse justify-end items-center gap-2"
      onClick={toggleValue}
    >
      <Show when={props.label}>
        <Label for={elProps.id} hasErrors={props.isInvalid}>
          {props.label}
        </Label>
      </Show>

      <div
        class={mergeClass(
          'relative cursor-pointer block rounded-md m-1 p-0 select-none border-2 border-solid transition-colors',
          size() === 'small' && 'w-4 h-4',
          size() === 'medium' && 'w-6 h-6',
          size() === 'large' && 'w-8 h-8',
          value() === false && 'bg-transparent',
          props.disabled
            ? [
                'opacity-30 cursor-default',
                value() === true && 'bg-[var(--muted-bg)]'
              ]
            : [
                'hover:border-[var(--color)]',
                value() === true && 'bg-[var(--color)]',
                focused()
                  ? 'border-[var(--color)] shadow-[0_0_4px_3px_var(--color-20)]'
                  : 'shadow-[0_0_4px_3px_transparent]'
              ]
        )}
        style={{
          '--color': `var(--${color()}-bg)`,
          '--color-20': `var(--${color()}-bg-20)`,
          '--check-color': `var(--${color()}-fg)`
        }}
        onKeyUp={(e) => {
          if (e.key === 'space') {
            toggleValue(e);
          }
        }}
      >
        <input
          {...elProps}
          type="checkbox"
          class={mergeClass(
            'left-0 top-0 w-full h-full opacity-0 pointer-events-none',
            elProps.class
          )}
          value={value() ? 'true' : 'false'}
          onBlur={mergeEventHandlers(elProps.onBlur, () => setFocused(false))}
          onFocus={mergeEventHandlers(elProps.onFocus, () => setFocused(true))}
        />

        <Show when={value() === true}>
          <Icons.Check
            style={{ scale: '1 !important' }}
            class={mergeClass(
              'absolute left-1/2 top-1/2 bg-transparent font-bold m-0 pointer-events-none select-none -translate-x-1/2 -translate-y-1/2',
              props.disabled
                ? 'text-[var(--muted-fg)]'
                : 'text-[var(--check-color)]',
              size() === 'small' && 'w-4 h-4 text-2xl',
              size() === 'medium' && 'w-6 h-6 text-4xl',
              size() === 'large' && 'w-8 h-8 text-6xl'
            )}
            variant="rounded"
          />
        </Show>
      </div>
    </div>
  );
};

export default Checkbox;
