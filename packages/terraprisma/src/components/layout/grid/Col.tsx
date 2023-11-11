import { JSX, ParentProps } from 'solid-js';
import { extendPropsFrom, componentBuilder } from 'utils';

export interface ColProps extends ParentProps {
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
}

const Col = componentBuilder<ColProps>()
  .factory(extendPropsFrom<ColProps, 'div'>(['size', 'children', 'style']))
  .create((props, elProps) => (
    <div
      {...elProps}
      class="px-[var(--gap)] py-[var(--row-gap)]"
      style={{
        width: `${(props.size / 24) * 100}%`,
        ...props.style
      }}
    >
      {props.children}
    </div>
  ));

export default Col;
