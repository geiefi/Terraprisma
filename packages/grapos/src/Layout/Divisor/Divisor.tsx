import { Component, JSX, splitProps } from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';

import './Divisor.scss';
import { forwardNativeElementProps } from '../../Helpers';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor: Component<DivisorProps> = forwardNativeElementProps<
  DivisorProps,
  HTMLDivElement
>(
  (props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass('divisor', elProps.class)}
        classList={{
          vertical: props.direction === 'vertical',
          ...elProps.classList,
        }}
      />
    );
  },
  ['direction']
);

export default Divisor;
