import { ParentProps, createEffect } from 'solid-js';

import { createEventListener } from '@solid-primitives/event-listener';

import { extendPropsFrom, makeComponent } from '@terraprisma/utils';
import { Dropdown, List } from '@terraprisma/general';

export interface MenuProps extends ParentProps {}

const Menu = makeComponent(
  [extendPropsFrom<MenuProps, typeof Dropdown>(['children'])],
  (props, elProps) => {
    createEffect(() => {
      elProps.ref && createEventListener(elProps.for, 'mousedown', () => {});
    });

    return (
      <Dropdown class="!w-[9rem] h-fit" {...elProps}>
        <List>{props.children}</List>
      </Dropdown>
    );
  }
);

export default Menu;
