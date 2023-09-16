import { JSX, ParentProps } from 'solid-js';
import { createComponentExtendingFromOther, mergeClass } from '@terraprisma/utils';

import './Stack.scss';

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

const Stack = createComponentExtendingFromOther<StackProps, 'div'>(
  (props, elProps) => (
    <div
      {...elProps}
      class={mergeClass('stack', elProps.class)}
      classList={{
        'full-width': props.fullWidth,
        horizontal:
          props.direction === 'horizontal' ||
          typeof props.direction === 'undefined',
        vertical: props.direction === 'vertical',
        ...elProps.classList
      }}
      style={{
        gap: `${props.spacing}px`,
        'justify-content': props.align,
        ...props.style
      }}
    >
      {props.children}
    </div>
  ),
  ['spacing', 'align', 'direction', 'fullWidth', 'children', 'style']
);

export default Stack;
