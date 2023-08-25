import { ComponentProps, JSX, ParentProps, Show, createSignal } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@grapos/utils';
import { Ripple } from '@grapos/core';
import { Divisor } from '@grapos/layout';
import { KeyboardArrowDown } from '@grapos/icons';
import { Collapse } from '@grapos/transitions';

import './List.scss';

export interface ListProps extends ParentProps {
  dense?: boolean;
}

const List = createComponentExtendingFromOther<ListProps, 'ul'>(
  (props, elProps) => (
    <ul
      {...elProps}
      class={mergeClass('unordered-list', elProps.class)}
      classList={{
        dense: props.dense
      }}
    >
      {props.children}
    </ul>
  ),
  ['children', 'dense']
) as {
  (props: ListProps & Omit<ComponentProps<'ul'>, keyof ListProps>): JSX.Element;
  Divisor(
    props: Omit<ComponentProps<typeof Divisor>, 'direction'>
  ): JSX.Element;
  ItemWithDetails(
    props: ListItemWithDetailsProps &
      Omit<ComponentProps<'li'>, keyof ListItemWithDetailsProps>
  ): JSX.Element;
  Item(
    props: ListItemProps & Omit<ComponentProps<'li'>, keyof ListItemProps>
  ): JSX.Element;
};

/**
 * @description Currently just the same exact thing as the {@link Divisor} component.
 */
List.Divisor = Divisor;

export interface ListItemWithDetailsProps extends ParentProps {
  subItems: JSX.Element;

  icon?: JSX.Element;
  active?: boolean;
}

List.ItemWithDetails = createComponentExtendingFromOther<
  ListItemWithDetailsProps,
  'li'
>(
  (props, elProps) => {
    const [showingDetails, setShowingDetails] = createSignal(false);

    return (
      <li
        {...elProps}
        class={mergeClass('list-item', elProps.class)}
        classList={{
          'has-icon': typeof props.icon !== 'undefined'
        }}
      >
        <Ripple>
          <div
            class="list-item-content clickable"
            classList={{
              active: props.active
            }}
            onClick={() => setShowingDetails((k) => !k)}
          >
            <Show when={props.icon}>
              {(icon) => <div class="list-item-icon">{icon()}</div>}
            </Show>
            {props.children}

            <div class="list-item-action">
              <KeyboardArrowDown
                variant="rounded"
                class="show-details-icon"
                classList={{
                  open: showingDetails()
                }}
              />
            </div>
          </div>
        </Ripple>

        <Collapse>
          <Show when={showingDetails()}>
            <List class="list-item-sub">{props.subItems}</List>
          </Show>
        </Collapse>
      </li>
    );
  },
  ['icon', 'children', 'subItems', 'active', 'children']
);

export interface ListItemProps extends ParentProps {
  icon?: JSX.Element;
  action?: JSX.Element;

  clickable?: boolean;
  active?: boolean;
}

List.Item = createComponentExtendingFromOther<ListItemProps, 'li'>(
  (props, elProps) => {
    const content = (
      <div
        class="list-item-content"
        classList={{
          active: props.active,
          clickable: props.clickable
        }}
      >
        <Show when={props.icon}>
          {(icon) => <div class="list-item-icon">{icon()}</div>}
        </Show>
        {props.children}

        <Show when={props.action}>
          {(action) => <div class="list-item-action">{action()}</div>}
        </Show>
      </div>
    );

    return (
      <li
        {...elProps}
        class={mergeClass('list-item', elProps.class)}
        classList={{
          'has-icon': typeof props.icon !== 'undefined'
        }}
      >
        <Show when={props.clickable} fallback={content}>
          <Ripple>{content}</Ripple>
        </Show>
      </li>
    );
  },
  ['children', 'clickable', 'icon', 'active', 'action']
);

export default List;
