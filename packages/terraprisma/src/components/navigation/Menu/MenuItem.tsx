import { ListItem } from '../../general';
import { ListItemProps } from '../../general/List/ListItem';

export type MenuItemProps = ListItemProps;

const MenuItem = (elProps: Omit<MenuItemProps, 'clickable'>) => {
  return (
    <ListItem {...elProps} clickable>
      {elProps.children}
    </ListItem>
  );
};

export default MenuItem;
