import { ComponentProps, JSX, ParentProps, Show } from 'solid-js';
import { forwardNativeElementProps } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';
import { Ripple } from '../../General';

import './List.scss';
import { Divisor } from '../../Layout';
import { GetProps } from '../../Helpers/Types/GetProps';

export interface ListProps extends ParentProps {
  dense?: boolean;
}

const List = forwardNativeElementProps<ListProps, HTMLUListElement>(
  (props, elProps) => {
    // const children = accessChildren(() => props.children);
    // const hasChildren = createMemo(() => {
    //   const accessedChildren = children();
    //   const childrenList = Array.isArray(accessedChildren)
    //     ? accessedChildren
    //     : [accessedChildren];
    //
    //   return childrenList.length > 0;
    // });

    return (
      <ul
        {...elProps}
        class={mergeClass('unordered-list', elProps.class)}
        classList={{
          dense: props.dense,
        }}
      >
        {props.children}
      </ul>
    );
  },
  ['children', 'dense']
) as {
  (props: ListProps & Omit<ComponentProps<'ul'>, keyof ListProps>): JSX.Element;
  Divisor(props: Omit<GetProps<typeof Divisor>, 'direction'>): JSX.Element;
  Item(
    props: ListItemProps & Omit<ComponentProps<'li'>, keyof ListItemProps>
  ): JSX.Element;
};

/**
 * @description Currently just the same exact thing as the {@link Divisor} component.
 */
List.Divisor = Divisor;

export interface ListItemProps extends ParentProps {
  icon?: JSX.Element;
  action?: JSX.Element;

  /**
   * @description Inserts another List inside this item with these items.
   */
  subItems?: JSX.Element;

  clickable?: boolean;
  active?: boolean;
}

List.Item = forwardNativeElementProps<ListItemProps, HTMLLIElement>(
  (props, elProps) => {
    const Content = () => (
      <div
        class="list-item-content"
        classList={{
          active: props.active,
          clickable: props.clickable,
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
          'has-icon': typeof props.icon !== 'undefined',
        }}
      >
        <Show when={props.clickable} fallback={<Content />}>
          <Ripple>
            <Content />
          </Ripple>
        </Show>

        <Show when={props.subItems}>
          {(subItems) => (
            <List class="list-item-sub" onClick={(e) => e.stopPropagation()}>
              {subItems()}
            </List>
          )}
        </Show>
      </li>
    );
  },
  ['children', 'clickable', 'icon', 'active', 'action', 'subItems']
);

export default List;
