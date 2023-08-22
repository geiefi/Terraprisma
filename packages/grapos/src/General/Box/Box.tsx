import {
  Accessor,
  Component,
  createContext,
  createMemo,
  JSX,
  ParentProps,
  splitProps,
  useContext,
} from 'solid-js';
import { mergeClass } from '../../_Shared/Utils';

import './Box.scss';

/**
 * @description Determines what depth the current context of box is in
 * to then determine its background color based on the theme's defined monochromatic scale.
 */
export type Depth = 0 | 1 | 2 | 3;

const BoxContext = createContext<Accessor<Depth>>();

export interface BoxProps
  extends ParentProps,
    JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * @description The depth of the current Box.
   *
   * This is a way to manually set the Box's context's depth and
   * its own background color when necessary, but normally this depth
   * is set automatically based on the context the Box is found on.
   */
  depth?: Depth;
}

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
const Box: Component<BoxProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['depth']);

  const oldDepth = useDepth();
  const depth = createMemo(() => {
    if (typeof props.depth !== 'undefined') return props.depth;

    if (typeof oldDepth !== 'undefined') return Math.min(oldDepth() + 1, 3);

    return 1;
  }) as Accessor<Depth>;

  return (
    <BoxContext.Provider value={depth}>
      <div
        {...elProps}
        class={mergeClass('box', elProps.class)}
        classList={{
          'gray-1': depth() === 1,
          'gray-2': depth() === 2,
          'gray-3': depth() === 3,
          ...elProps.classList,
        }}
        style={elProps.style}
      >
        {elProps.children}
      </div>
    </BoxContext.Provider>
  );
};

export function useDepth(): Accessor<Depth> | undefined {
  return useContext(BoxContext);
}

export default Box;
