import { JSX, ParentProps, createMemo } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@terraprisma/utils';

import './Colored.scss';
import { PossibleColors } from '@terraprisma/core';

interface ColorProps extends ParentProps {
  color: PossibleColors;

  style?: JSX.CSSProperties;
}

const Colored = createComponentExtendingFromOther<ColorProps, 'span'>(
  (props, elProps) => {
    const color = createMemo(() => `var(--${props.color})`);

    return (
      <span
        {...elProps}
        style={{
          ...props.style,
          '--color': color()
        }}
        class={mergeClass('colored', elProps.class)}
      >
        {props.children}
      </span>
    );
  },
  ['color', 'children', 'style']
);

export default Colored;
