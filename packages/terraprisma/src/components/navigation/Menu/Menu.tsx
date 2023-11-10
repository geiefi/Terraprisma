import { ParentProps } from 'solid-js';

import { extendPropsFrom, componentBuilder } from '~';
import { Dropdown, List } from '@terraprisma/general';

export interface MenuProps extends ParentProps {}

const Menu = componentBuilder<MenuProps>()
  .factory(extendPropsFrom<MenuProps, typeof Dropdown>(['children']))
  .create((props, elProps) => {
    return (
      <Dropdown class="!w-[9rem] h-fit" {...elProps}>
        <List>{props.children}</List>
      </Dropdown>
    );
  });

export default Menu;
