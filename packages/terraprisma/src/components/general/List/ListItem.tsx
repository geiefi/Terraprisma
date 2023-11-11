import { JSX, Match, ParentProps, Switch, createMemo } from 'solid-js';

import Ripple from '../Ripple';
import { Accents } from '../../..';
import {
  componentBuilder,
  addAccentColoring,
  extendPropsFrom,
  mergeClass
} from '../../../utils';

export interface ListItemProps extends ParentProps {
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

  /**
   * @default false
   */
  disabled?: boolean;

  style?: JSX.CSSProperties;
}

const ListItem = componentBuilder<ListItemProps>()
  .factory(addAccentColoring<ListItemProps>())
  .factory(
    extendPropsFrom<ListItemProps & { color?: Accents }, 'li'>([
      'children',
      'disabled',
      'clickable',
      'active',
      'style',
      'color'
    ])
  )
  .create((props, color, elProps) => {
    const clickable = createMemo(() => props.clickable ?? false);
    const disabled = createMemo(() => props.disabled ?? false);
    const active = createMemo(() => props.active ?? false);

    return (
      <Switch>
        <Match when={clickable()}>
          <Ripple
            color={color()}
            contrastWithBg={active()}
            noRipple={disabled()}
          >
            <li
              aria-disabled={disabled()}
              {...elProps}
              class={mergeClass(
                'w-full h-fit px-2.5 py-1 rounded-md transition-colors select-none cursor-pointer',
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
  });

export default ListItem;
