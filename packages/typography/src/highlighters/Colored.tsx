import { JSX, ParentProps } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import './Colored.scss';
import { Accents, addAccentColoring } from '@terraprisma/core';

interface ColoredProps extends ParentProps {
  style?: JSX.CSSProperties;
}

const Colored = makeComponent(
  [
    addAccentColoring<ColoredProps>(),
    extendPropsFrom<ColoredProps & { color?: Accents }, 'span'>([
      'color',
      'children',
      'style'
    ])
  ],
  (props, color, elProps) => {
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
  }
);

export default Colored;
