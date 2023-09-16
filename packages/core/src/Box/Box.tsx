import { ParentProps } from 'solid-js';
import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

import './Box.scss';

export interface BoxProps extends ParentProps {}

/**
 * @description A component used for having a kind of box, this Box creates a context automatically
 * that communicates to other boxes inside the depth that they should have automatically changing
 * their color accordingly.
 *
 * @example
 * ```tsx
 * <Box>
 *   <h1>Box with depth 1</h1>
 *
 *   <Box>
 *     <h2>Box with depth 2</h2>
 *   </Box>
 * </Box>
 * ```
 */
const Box = makeComponent(
  [extendPropsFrom<BoxProps, 'div'>(['children'])],
  (props, elProps) => (
    <div
      {...elProps}
      class={mergeClass('box', elProps.class)}
      style={elProps.style}
    >
      {props.children}
    </div>
  )
);

export default Box;
