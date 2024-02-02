import { mergeClass } from '../../../utils';
import { Dropdown, List } from '../../general';
import { DropdownProps } from '../../general/Dropdown';

export type MenuProps = DropdownProps;

const Menu = (elProps: MenuProps) => {
  return (
    <Dropdown {...elProps} class={mergeClass('!w-[9rem] h-fit', elProps.class)}>
      <List>{elProps.children}</List>
    </Dropdown>
  );
};

export default Menu;
