import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@grapos/utils';

import './Colored.scss';

interface ColorProps extends ParentProps {
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'danger'
    | 'success'
    | 'warning';
}

const Colored = createComponentExtendingFromOther<ColorProps, 'span'>(
  (props, elProps) => {
    return (
      <span
        {...elProps}
        class={mergeClass('colored', props.color, elProps.class)}
      >
        {props.children}
      </span>
    );
  },
  ['color', 'children']
);

export default Colored;
