import { ParentProps, Show } from 'solid-js';

import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';

export interface ListProps extends ParentProps {}

const List = makeComponent(
  [extendPropsFrom<ListProps, 'ul'>(['children'])],
  (props, elProps) => (
    <ul
      {...elProps}
      class={mergeClass(
        'list-none flex flex-col h-fit w-full gap-1 py-2 p-0 m-0',
        elProps.class
      )}
    >
      {props.children}
    </ul>
  )
);

export default List;
