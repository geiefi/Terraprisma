import { Accessor, Component, createContext, createMemo, JSX, ParentProps, useContext } from "solid-js";

import './Box.scss';

/**
 * @description Determines what depth the current context of box is in
 * to then determine its background color based on the theme's defined monochromatic scale. 
 */
type Depth = 0 | 1 | 2 | 3 | 4;

const BoxContext = createContext<Accessor<Depth>>();

export type BoxProps = ParentProps<{
  style?: JSX.CSSProperties,
}>;

const Box: Component<BoxProps> = (props) => {
  const oldDepth = useContext(BoxContext);
  const depth = createMemo(() => {
    if (typeof oldDepth !== 'undefined') {
      return Math.min(oldDepth() + 1, 3);
    } else {
      return 1;
    }
  }) as Accessor<Depth>;

  return <BoxContext.Provider value={depth}>
    <div 
      class='box' 
      classList={{
        'gray-1': depth() === 1,
        'gray-2': depth() === 2,
        'gray-3': depth() === 3,
        'bordered': (oldDepth || (() => 0))() === 3
      }}
      style={props.style}
    >
      {props.children}
    </div>
  </BoxContext.Provider>;
};

export default Box;

