import { ComponentProps, JSX, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type RowProps = LeftIntersection<
  {
    gap?: string;
    rowGap?: string;

    style?: JSX.CSSProperties;
  },
  ComponentProps<'div'>
>;

const Row = (allProps: RowProps) => {
  const [props, elProps] = splitProps(allProps, [
    'gap',
    'rowGap',
    'children',
    'style'
  ]);
  return (
    <div
      {...elProps}
      class={mergeClass('tp-flex w-100 tp-flex-wrap', elProps.class)}
      classList={elProps.classList}
      style={{
        '--gap': props.gap,
        '--row-gap': props.rowGap,
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
};

export default Row;
