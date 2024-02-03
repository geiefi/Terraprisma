import { ComponentProps, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';

export interface ListProps extends ParentProps, ComponentProps<'ul'> { }

const List = (allProps: ListProps) => {
  const [props, elProps] = splitProps(allProps, ['children']);
  return (
    <ul
      {...elProps}
      class={mergeClass(
        'tp-list-none tp-flex tp-flex-col tp-h-fit tp-w-full tp-gap-2 tp-p-0 tp-m-0',
        elProps.class
      )}
    >
      {props.children}
    </ul>
  );
};

export default List;
