import { ParentProps } from 'solid-js';

import { extendPropsFrom, makeComponent } from '@terraprisma/utils';
import { Dropdown, List } from '@terraprisma/general';

export interface MenuProps extends ParentProps {}

const Menu = makeComponent(
  [extendPropsFrom<MenuProps, typeof Dropdown>(['children'])],
  (props, elProps) => {
    return (
      <Dropdown class="!w-[9rem] h-fit" {...elProps}>
        <List>{props.children}</List>
      </Dropdown>
    );
  }
);

export default Menu;
