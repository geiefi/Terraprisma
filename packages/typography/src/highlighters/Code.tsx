import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@terraprisma/utils';

import './Code.scss';

const Code = createComponentExtendingFromOther<ParentProps, 'code'>(
  (props, elProps) => (
    <code {...elProps} class={mergeClass('code-inline', elProps.class)}>
      {props.children}
    </code>
  ),
  ['children']
);

export default Code;
