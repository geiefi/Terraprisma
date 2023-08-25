import { Component } from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';

import './Divisor.scss';
import { forwardComponentProps } from '../../Helpers';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor: Component<DivisorProps> = forwardComponentProps<
  DivisorProps,
  'div'
>(
  (props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass('divisor', elProps.class)}
        classList={{
          vertical: props.direction === 'vertical',
          ...elProps.classList
        }}
      />
    );
  },
  ['direction']
);

export default Divisor;
