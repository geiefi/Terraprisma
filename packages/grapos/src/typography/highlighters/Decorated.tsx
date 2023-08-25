import { ParentProps } from 'solid-js';

import { forwardComponentProps } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';

import './Decorated.scss';

export type TypographyDecoration =
  | 'disabled'
  | 'underlined'
  | 'line-through'
  | 'overlined';

export interface DecoratedProps extends ParentProps {
  decoration: TypographyDecoration;
}

const Decorated = forwardComponentProps<DecoratedProps, 'span'>(
  (props, elProps) => {
    return (
      <span
        {...elProps}
        class={mergeClass('decorated', props.decoration, elProps.class)}
      >
        {props.children}
      </span>
    );
  },
  ['decoration', 'children'],
);

export default Decorated;
