import {
  Accessor,
  ComponentProps,
  JSX,
  Setter,
  createSignal,
  splitProps
} from 'solid-js';
import { Accents } from '../../..';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';
import { createValueSignal } from './createValueSignal';

export type TogglerProps = LeftIntersection<
  {
    size?: 'small' | 'medium' | 'large';
    color?: Accents;

    value?: boolean;
    onChange?: (value: boolean, event: MouseEvent) => any;
  },
  ComponentProps<'input'>
>;

const Toggler = (allProps: TogglerProps) => {
  const [props, elProps] = splitProps(allProps, [
    'color',
    'value',
    'size',
    'onChange'
  ]);

  const [value, setValue] = createValueSignal(() => props.value ?? false);

  const color = () => props.color ?? 'accent';
  const size = () => props.size ?? 'medium';

  return (
    <input
      {...elProps}
      type="checkbox"
      class={mergeClass(
        'appearance-none transition-colors relative',
        'after:content-[""] after:absolute after:top-1/2 after:rounded-full after:-translate-y-1/2 after:transition-all',
        size() === 'small' &&
          'w-6 h-3 after:w-2.5 after:h-2.5 rounded-[0.75rem]',
        size() === 'medium' && 'w-10 h-5 after:w-4 after:h-4 rounded-[1.3rem]',
        size() === 'large' &&
          'w-16 h-8 after:w-6.5 after:h-6.5 rounded-[4.1rem]',

        value() === true
          ? 'after:left-[calc(100%-0.25rem)] after:-translate-x-full'
          : 'after:left-1',

        elProps.disabled
          ? 'cursor-default bg-[var(--muted-bg)] after:bg-[var(--muted-fg)] opacity-30'
          : [
              'cursor-pointer',
              value() === true
                ? 'bg-[var(--on-color)] after:bg-[var(--on-circle-color)]'
                : 'bg-[var(--deeper-bg)] after:bg-[var(--normal-bg)]'
            ],

        elProps.class
      )}
      style={{
        '--on-color': `var(--${color()}-bg)`,
        '--on-circle-color': `var(--${color()}-fg)`
      }}
      classList={{
        on: value() === true,

        disabled: elProps.disabled,

        small: props.size === 'small',
        medium: props.size === 'medium' || typeof props.size === 'undefined',
        large: props.size === 'large',

        ...elProps.classList
      }}
      value={value() ? 'on' : 'off'}
      onClick={(event) => {
        if (!elProps.disabled) {
          const newValue = !value();
          setValue(newValue);

          props.onChange?.(newValue, event);
        }
      }}
    />
  );
};

export default Toggler;
