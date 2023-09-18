import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

import './Divisor.scss';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor = makeComponent(
  [extendPropsFrom<DivisorProps, 'div'>(['direction'])],
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
  }
);

export default Divisor;
