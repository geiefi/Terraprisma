import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '../../utils';

import './Decorated.scss';

export type TypographyDecoration =
  | 'disabled'
  | 'underlined'
  | 'line-through'
  | 'overlined';

export interface DecoratedProps extends ParentProps {
  decoration: TypographyDecoration;
}

const Decorated = createComponentExtendingFromOther<DecoratedProps, 'span'>(
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
  ['decoration', 'children']
);

export default Decorated;
