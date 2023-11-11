import { ParentProps } from 'solid-js';

import { extendPropsFrom, componentBuilder } from 'utils';
import { ListItem } from 'components/general';

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
