import { ParentProps } from 'solid-js';

import { extendPropsFrom, makeComponent } from '@terraprisma/utils';
import { ListItem } from '@terraprisma/general';

export interface MenuProps extends ParentProps {}

const MenuItem = makeComponent(
  [extendPropsFrom<MenuProps, typeof ListItem>(['children'])],
  (props, elProps) => {
    return (
      <ListItem {...elProps} clickable>
        {props.children}
      </ListItem>
    );
  }
);

export default MenuItem;
