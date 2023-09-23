import { ParentProps } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import './Code.scss';

const Code = makeComponent(
  [extendPropsFrom<ParentProps, 'code'>(['children'])],
  (props, elProps) => (
    <code {...elProps} class={mergeClass('code-inline', elProps.class)}>
      {props.children}
    </code>
  )
);

export default Code;
