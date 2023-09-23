import { ParentProps } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import './Marked.scss';

const Marked = makeComponent(
  [extendPropsFrom<ParentProps, 'mark'>(['children'])],
  (props, elProps) => {
    return (
      <mark {...elProps} class={mergeClass('marked', elProps.class)}>
        {props.children}
      </mark>
    );
  }
);

export default Marked;
