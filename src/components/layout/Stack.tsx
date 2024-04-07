import {
  ComponentProps,
  JSX,
  createMemo,
  splitProps
} from 'solid-js';
import { mergeClass } from '../../utils';
import { LeftIntersection } from '../../types/LeftIntersection';

export type StackProps = LeftIntersection<
  {
    spacing?: number;
    align?:
      | 'center'
      | 'start'
      | 'end'
      | 'space-between'
      | 'space-around'
      | 'space-evenly';
    direction?: 'horizontal' | 'vertical';
    fullWidth?: boolean;

    style?: JSX.CSSProperties;
  },
  ComponentProps<'div'>
>;

const Stack = (allProps: StackProps) => {
  const [props, elProps] = splitProps(allProps, [
    'spacing',
    'align',
    'direction',
    'fullWidth',
    'children',
    'style'
  ]);
  const direction = createMemo(() => props.direction ?? 'horizontal');
  return (
    <div
      {...elProps}
      class={mergeClass(
        'flex flex-wrap',
        props.fullWidth && 'full-width',
        direction() === 'horizontal' && 'flex-row',
        direction() === 'vertical' && 'flex-col',
        elProps.class
      )}
      style={{
        gap: `${props.spacing}px`,
        'justify-content': props.align,
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
};

export default Stack;
