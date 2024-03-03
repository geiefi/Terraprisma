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
              'w-full h-fit px-2.5 py-1 rounded-md transition-colors select-none cursor-pointer',
              'group-data-[size=large]:px-4 group-data-[size=large]:py-2 group-data-[size=large]:rounded-lg',
              'group-data-[size=medium]:px-2.5 group-data-[size=medium]:py-1 group-data-[size=medium]:rounded-md',
              'group-data-[size=small]:px-1.5 group-data-[size=small]:py-0.5 group-data-[size=small]:rounded-md',
              disabled()
                ? 'bg-[var(--muted-bg)] text-[var(--muted-fg)] opacity-30'
                : [
                    active()
                      ? 'bg-[var(--bg)] text-[var(--fg)]'
                      : 'hover:bg-[var(--hover-10)]'
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
          class={mergeClass('w-full h-fit px-2.5 py-1', elProps.class)}
        >
          {props.children}
        </li>
      </Match>
    </Switch>
  );
};

export default ListItem;
