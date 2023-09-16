import { mergeClass, createComponentExtendingFromOther } from '@terraprisma/utils';

import './Divisor.scss';

export interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
}

const Divisor = createComponentExtendingFromOther<DivisorProps, 'div'>(
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
