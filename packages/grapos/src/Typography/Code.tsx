import { ParentProps, createMemo } from 'solid-js';

import { useDepth } from '../General/Box/Box';

import { forwardNativeElementProps } from '../Helpers';
import { mergeClass } from '../_Shared/Utils';

import './Code.scss';

export interface CodeProps extends ParentProps {
}

const Code = forwardNativeElementProps<CodeProps, HTMLElement>(
  (props, elProps) => {
    const originalDepth = useDepth();
    const depth = createMemo(() => typeof originalDepth !== 'undefined' ? originalDepth() : 0);

    return <code 
      {...elProps} 
      class={mergeClass('code-inline', elProps.class)}
      classList={{
        'depth-0': depth() === 0,
        'depth-1': depth() === 1,
        'depth-2': depth() === 2,
        'depth-3': depth() === 3,
        ...elProps.classList,
      }}
    >
      {props.children}
    </code>;
  },
  ['children'],
);

export default Code;