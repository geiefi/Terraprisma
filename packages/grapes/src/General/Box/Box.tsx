import { Accessor, Component, createContext, createMemo, JSX, ParentProps, useContext } from "solid-js";

import './Box.scss';

/**
 * @description Determines what depth the current context of box is in
 * to then determine its background color based on the theme's defined monochromatic scale. 
 */
export type Depth = 0 | 1 | 2 | 3 | 4;

const BoxContext = createContext<Accessor<Depth>>();

export type BoxProps = ParentProps<{
  depth?: Depth,

  style?: JSX.CSSProperties,
  class?: string,
  classList?: Record<string, boolean | undefined>
}>;

/**
 * @description A component used for having a kind of box, this Box creates a context automatically 
 * that communicates to other boxes inside the depth that they should have automatically changing
 * their color accordingly.
 *
 * @example
 * ```tsx
 * <Box>
 *   <h1>Box with depth 1</h1>
 *
 *   <Box>
 *     <h2>Box with depth 2</h2>
 *   </Box>
 * </Box>
 * ```
 */
const Box: Component<BoxProps> = (props) => {
  const oldDepth = useContext(BoxContext);
  const depth = createMemo(() => {
    if (typeof props.depth !== 'undefined') return props.depth;

    if (typeof oldDepth !== 'undefined') return Math.min(oldDepth() + 1, 3);

    return 1;
  }) as Accessor<Depth>;

  return <BoxContext.Provider value={depth}>
    <div 
      class={'box ' + (props.class || '')} 
      classList={{
        'gray-1': depth() === 1,
        'gray-2': depth() === 2,
        'gray-3': depth() === 3,
        'bordered': (oldDepth || (() => 0))() === 3,
        ...props.classList
      }}
      style={props.style}
    >
      {props.children}
    </div>
  </BoxContext.Provider>;
};

export function useDepth(): Accessor<Depth> | undefined {
  return useContext(BoxContext);
}

export default Box;

