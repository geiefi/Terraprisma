import { ComponentProps, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type ListProps = LeftIntersection<ComponentProps<'ul'>, {
  size?: 'small' | 'medium' | 'large';
}>;

const List = (allProps: ListProps) => {
  const [props, elProps] = splitProps(allProps, ['children', 'size']);
  return (
    <ul
      {...elProps}
      data-size={props.size ?? 'medium'}
      class={mergeClass(
        'list-none group flex flex-col h-fit w-full p-0 m-0',
        'data-[size=small]:text-sm data-[size=medium]:text-base data-[size=large]:text-xl',
        'data-[size=small]:gap-1 data-[size=medium]:gap-2 data-[size=large]:gap-3.5',
        elProps.class
      )}
    >
      {props.children}
    </ul>
  );
};

export default List;
