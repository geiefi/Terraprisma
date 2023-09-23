import { ParentProps } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import './Decorated.scss';

export type TypographyDecoration =
  | 'disabled'
  | 'underlined'
  | 'line-through'
  | 'overlined';

export interface DecoratedProps extends ParentProps {
  decoration: TypographyDecoration;
}

const Decorated = makeComponent(
  [extendPropsFrom<DecoratedProps, 'span'>(['decoration', 'children'])],
  (props, elProps) => {
    return (
      <span
        {...elProps}
        class={mergeClass('decorated', props.decoration, elProps.class)}
      >
        {props.children}
      </span>
    );
  }
);

export default Decorated;
