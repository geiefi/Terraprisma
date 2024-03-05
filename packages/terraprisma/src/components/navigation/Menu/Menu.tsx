import { mergeClass } from '../../../utils';
import { Popover, List } from '../../general';
import { PopoverProps } from '../../general/Popover';

export type MenuProps = PopoverProps;

const Menu = (elProps: MenuProps) => {
  return (
    <Popover {...elProps} class={mergeClass('!w-[9rem] h-fit', elProps.class)}>
      <List>{elProps.children}</List>
    </Popover>
  );
};

export default Menu;
