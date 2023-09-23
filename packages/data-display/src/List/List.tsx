import { ComponentProps, JSX, ParentProps, Show, createSignal } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';
import { Ripple } from '@terraprisma/core';
import { Divisor } from '@terraprisma/layout';
import { KeyboardArrowDown } from '@terraprisma/icons';
import { Collapse } from '@terraprisma/transitions';

import './List.scss';

export interface ListProps extends ParentProps {
  dense?: boolean;
}

const List = makeComponent(
  [extendPropsFrom<ListProps, 'ul'>(['children', 'dense'])],
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
  )
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

List.ItemWithDetails = makeComponent(
  [
    extendPropsFrom<ListItemWithDetailsProps, 'li'>([
      'icon',
      'children',
      'subItems',
      'active',
      'children'
    ])
  ],
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
  }
);

export interface ListItemProps extends ParentProps {
  icon?: JSX.Element;
  action?: JSX.Element;

  clickable?: boolean;
  active?: boolean;
}

List.Item = makeComponent(
  [
    extendPropsFrom<ListItemProps, 'li'>([
      'children',
      'clickable',
      'icon',
      'active',
      'action'
    ])
  ],
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
  }
);

export default List;
