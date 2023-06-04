import { Component, JSX, splitProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

import './Divisor.scss';

export interface DivisorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
}

const Divisor: Component<DivisorProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['direction']);

  return <div 
    {...elProps}
    class={mergeClass('divisor', elProps.class)} 
    classList={{
      'vertical': props.direction === 'vertical',
      ...elProps.classList
    }}
  />;
};

export default Divisor;
