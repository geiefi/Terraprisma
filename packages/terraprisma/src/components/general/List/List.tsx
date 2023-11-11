import { ParentProps } from 'solid-js';
import { componentBuilder, extendPropsFrom, mergeClass } from '../../../utils';

export interface ListProps extends ParentProps {}

const List = componentBuilder<ListProps>()
  .factory(extendPropsFrom<ListProps, 'ul'>(['children']))
  .create((props, elProps) => (
    <ul
      {...elProps}
      class={mergeClass(
        'list-none flex flex-col h-fit w-full gap-2 p-0 m-0',
        elProps.class
      )}
    >
      {props.children}
    </ul>
  ));

export default List;
