import { ParentProps } from 'solid-js';
import { createComponentExtendingFromOther } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';

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