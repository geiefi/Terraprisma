import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@grapos/utils';

import './Marked.scss';

const Marked = createComponentExtendingFromOther<ParentProps, 'mark'>(
  (props, elProps) => {
    return (
      <mark {...elProps} class={mergeClass('marked', elProps.class)}>
        {props.children}
      </mark>
    );
  },
  ['children']
);

export default Marked;
