import { JSX, ParentProps, Show, createEffect, createSignal } from 'solid-js';

import {
  extendPropsFrom,
  componentBuilder,
  mergeCallbacks,
  mergeClass
} from '@terraprisma/utils';
import { Accents, addAccentColoring } from '@terraprisma/core';
import { Collapse } from '@terraprisma/transitions';
import { KeyboardArrowDown } from '@terraprisma/icons';

import ListItem from './ListItem';

export interface ListItemWithDetailsProps extends ParentProps {
  /**
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  active?: boolean;

  style?: JSX.CSSProperties;

  showingDetails?: boolean;

  details: JSX.Element;
}

const ListItemWithDetails = componentBuilder<ListItemWithDetailsProps>()
  .factory(addAccentColoring<ListItemWithDetailsProps>())
  .factory(
    extendPropsFrom<ListItemWithDetailsProps & { color?: Accents }, 'li'>([
      'children',
      'color',
      'details',
      'active',
      'showingDetails',
      'disabled'
    ])
  )
  .create((props, color, elProps) => {
    const [isDetailsOpen, setDetailsOpen] = createSignal(false);
    createEffect(() => {
      if (typeof props.showingDetails !== 'undefined') {
        setDetailsOpen(props.showingDetails);
      }
    });

    return (
      <>
        <ListItem
          {...elProps}
          class={mergeClass('relative', elProps.class)}
          color={color()}
          active={props.active}
          style={props.style}
          clickable
          onClick={mergeCallbacks(
            elProps.onClick,
            () =>
              typeof props.showingDetails === 'undefined' &&
              setDetailsOpen((isOpen) => !isOpen)
          )}
          disabled={props.disabled}
        >
          {props.children}

          <span
            class={mergeClass(
              'absolute right-2.5 top-1/2 translate-y-[-50%] origin-center transition-transform',
              isDetailsOpen() && 'rotate-180'
            )}
          >
            <KeyboardArrowDown />
          </span>
        </ListItem>

        <Collapse>
          <Show when={isDetailsOpen()}>{props.details}</Show>
        </Collapse>
      </>
    );
  });

export default ListItemWithDetails;
