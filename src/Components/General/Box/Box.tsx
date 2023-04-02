import { Accessor, Component, createContext, createMemo, ParentProps, useContext } from "solid-js";

import './Box.scss';

/**
 * @description Determines what depth the current context of box is in
 * to then determine its background color based on the theme's defined monochromatic scale. 
 */
type Depth = 0 | 1 | 2 | 3 | 4;

const BoxContext = createContext<Accessor<Depth>>();

const Box: Component<ParentProps> = ({ children }) => {
  const oldDepth = useContext(BoxContext);
  const depth = createMemo(() => {
    console.log(oldDepth);
    if (typeof oldDepth !== 'undefined') {
      return Math.max(oldDepth() + 1, 4);
    } else {
      return 0;
    }
  }) as Accessor<Depth>;

  return <BoxContext.Provider value={depth}>
    <div class='box' classList={{
      'gray-0': depth() === 0,
      'gray-1': depth() === 1,
      'gray-2': depth() === 2,
      'gray-3': depth() === 3,
      'gray-4': depth() === 4,
    }}>
      {children}
    </div>
  </BoxContext.Provider>;
};

export default Box;

