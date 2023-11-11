import { JSX, ParentProps, createMemo } from 'solid-js';
import { extendPropsFrom, componentBuilder, mergeClass } from 'utils';

export interface StackProps extends ParentProps {
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
}

const Stack = componentBuilder<StackProps>()
  .factory(
    extendPropsFrom<StackProps, 'div'>([
      'spacing',
      'align',
      'direction',
      'fullWidth',
      'children',
      'style'
    ])
  )
  .create((props, elProps) => {
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
  });

export default Stack;
