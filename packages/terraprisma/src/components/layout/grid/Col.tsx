import { ComponentProps, JSX, splitProps } from 'solid-js';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type ColProps = LeftIntersection<
  {
    size:
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15
      | 16
      | 17
      | 18
      | 19
      | 20
      | 21
      | 22
      | 23
      | 24;

    style?: JSX.CSSProperties;
  },
  ComponentProps<'div'>
>;

const Col = (allProps: ColProps) => {
  const [props, elProps] = splitProps(allProps, ['size', 'children', 'style']);
  return (
    <div
      {...elProps}
      class="tp-px-[var(--gap)] tp-py-[var(--row-gap)]"
      style={{
        width: `${(props.size / 24) * 100}%`,
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
};

export default Col;
