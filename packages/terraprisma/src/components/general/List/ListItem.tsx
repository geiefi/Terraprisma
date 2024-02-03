import {
  ComponentProps,
  JSX,
  Match,
  ParentProps,
  Switch,
  splitProps
} from 'solid-js';

import { Accents, Ripple } from '../../..';
import { mergeClass } from '../../../utils';

export interface ListItemProps
  extends ParentProps,
    Omit<ComponentProps<'li'>, 'color' | 'children' | 'active'> {
  /**
   * @default false
   */
  clickable?: boolean;
  /**
   * Only applicable when {@link clickable} is true
   *
   * @default false
   */
  active?: boolean;

  color?: Accents;

  /**
   * @default false
   */
  disabled?: boolean;

  style?: JSX.CSSProperties;
}

const ListItem = (allProps: ListItemProps) => {
  const [props, elProps] = splitProps(allProps, [
    'clickable',
    'active',
    'color',
    'disabled',
    'style',
    'children'
  ]);

  const color = () => props.color ?? 'accent';
  const clickable = () => props.clickable ?? false;
  const disabled = () => props.disabled ?? false;
  const active = () => props.active ?? false;

  return (
    <Switch>
      <Match when={clickable()}>
        <Ripple color={color()} contrastWithBg={active()} noRipple={disabled()}>
          <li
            aria-disabled={disabled()}
            {...elProps}
            class={mergeClass(
              'tp-w-full tp-h-fit tp-px-2.5 tp-py-1 tp-rounded-md tp-transition-colors tp-select-none tp-cursor-pointer',
              disabled()
                ? 'tp-bg-[var(--muted-bg)] tp-text-[var(--muted-fg)] tp-opacity-30'
                : [
                    active()
                      ? 'tp-bg-[var(--bg)] tp-text-[var(--fg)]'
                      : 'hover:tp-bg-[var(--hover-10)]'
                  ],
              elProps.class
            )}
            style={{
              '--bg': `var(--${color()}-bg)`,
              '--fg': `var(--${color()}-fg)`,
              '--hover-10': `var(--${color()}-hover-10)`,
              ...props.style
            }}
          >
            {props.children}
          </li>
        </Ripple>
      </Match>

      <Match when={!clickable()}>
        <li
          {...elProps}
          class={mergeClass('tp-w-full tp-h-fit tp-px-2.5 tp-py-1', elProps.class)}
        >
          {props.children}
        </li>
      </Match>
    </Switch>
  );
};

export default ListItem;
