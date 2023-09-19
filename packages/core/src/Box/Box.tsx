import { ParentProps } from 'solid-js';
import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

import './Box.scss';

export interface BoxProps extends ParentProps {}

/**
 * @description A component used for having a kind of box.
 * It uses the `floating.bg` and `floating.fg` for its *background* and *text* color respectively.
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
