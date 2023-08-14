import { ParentProps, Show, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import { forwardNativeElementProps } from "../Helpers";
import { Divisor } from "../Layout";

import './Title.scss';

export interface TitleProps extends ParentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title = forwardNativeElementProps<TitleProps, HTMLHeadingElement>(
  (props, elProps) => {
    const element = createMemo(() => props.as ?? 'h1');

    return <>
      <Dynamic 
        component={'h1'} 
        {...elProps} 
        classList={{
          'header-1': element() === 'h1',
          'header-2': element() === 'h2',
          'header-3': element() === 'h3',
          'header-4': element() === 'h4',
          'header-5': element() === 'h5',
          'header-6': element() === 'h6',
          ...elProps.classList,
        }}
      >
        {props.children}
      </Dynamic>
      <Show when={['h1', 'h2'].includes(element())}>
        <Divisor />
      </Show>
    </>;
  },
  ['children']
);

export default Title;