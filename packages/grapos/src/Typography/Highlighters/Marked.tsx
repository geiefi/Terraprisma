import { ParentProps } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';

import './Marked.scss';

const Marked = forwardNativeElementProps<ParentProps, HTMLElement>(
  (props, elProps) => {
    return <mark {...elProps} class={mergeClass('marked', elProps.class)}>
      {props.children}
    </mark>;
  },
  ['children']
);

export default Marked;