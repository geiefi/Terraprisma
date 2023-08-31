import { JSX, ParentProps, createMemo } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@grapos/utils';

import './Colored.scss';

interface ColorProps extends ParentProps {
  color: 'accent' | `accent-${string}` | 'danger' | 'success' | 'warning';

  style?: JSX.CSSProperties;
}

const Colored = createComponentExtendingFromOther<ColorProps, 'span'>(
  (props, elProps) => {
    const color = createMemo(() => {
      if (['danger', 'success', 'warning'].includes(props.color)) {
        return `var(--${props.color})`;
      } else {
        return `var(--${props.color}-bg)`;
      }
    });

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
