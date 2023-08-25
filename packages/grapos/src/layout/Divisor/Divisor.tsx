import { Component } from 'solid-js';

import { mergeClass, createComponentExtendingFromOther } from '../../utils';

import './Divisor.scss';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor: Component<DivisorProps> = createComponentExtendingFromOther<
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
