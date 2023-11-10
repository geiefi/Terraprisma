import { ParentProps } from 'solid-js';

import { extendPropsFrom, componentBuilder } from '@terraprisma/utils';
import { ListItem } from '@terraprisma/general';

export interface MenuProps extends ParentProps {}

const MenuItem = componentBuilder<MenuProps>()
  .factory(extendPropsFrom<MenuProps, typeof ListItem>(['children']))
  .create((props, elProps) => {
    return (
      <ListItem {...elProps} clickable>
        {props.children}
      </ListItem>
    );
  });

export default MenuItem;
