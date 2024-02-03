import { mergeClass } from '../../../utils';
import { Dropdown, List } from '../../general';
import { DropdownProps } from '../../general/Dropdown';

export type MenuProps = DropdownProps;

const Menu = (elProps: MenuProps) => {
  return (
    <Dropdown {...elProps} class={mergeClass('!tp-w-[9rem] tp-h-fit', elProps.class)}>
      <List>{elProps.children}</List>
    </Dropdown>
  );
};

export default Menu;
