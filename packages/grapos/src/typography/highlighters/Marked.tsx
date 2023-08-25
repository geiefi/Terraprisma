import { ParentProps } from 'solid-js';

import { forwardComponentProps } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';

import './Marked.scss';

const Marked = forwardComponentProps<ParentProps, 'mark'>(
  (props, elProps) => {
    return (
      <mark {...elProps} class={mergeClass('marked', elProps.class)}>
        {props.children}
      </mark>
    );
  },
  ['children'],
);

export default Marked;

