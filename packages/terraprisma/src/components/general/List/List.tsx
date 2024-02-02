import { ComponentProps, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';

export interface ListProps extends ParentProps, ComponentProps<'ul'> { }

const List = (allProps: ListProps) => {
  const [props, elProps] = splitProps(allProps, ['children']);
  return (
    <ul
      {...elProps}
      class={mergeClass(
        'list-none flex flex-col h-fit w-full gap-2 p-0 m-0',
        elProps.class
      )}
    >
      {props.children}
    </ul>
  );
};

export default List;
