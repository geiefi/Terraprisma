import { ParentProps, createContext, useContext } from "solid-js";

const ForceManualControlContext = createContext<boolean>(false);

/**
 * @see {@link ForceManualControl}
 */
export function isForcingManualControl() {
  return useContext(ForceManualControlContext);
}

/**
 * @description Creates a context that when any field detects forces them to be manually
 * controlled instead of controlled by the Form. This is useful to override the Form context
 * and have fields with differing behavior from a point down on the tree.
 *
 * Be aware that the `manuallyControlled` prop from fields can actually override the value
 * from this.
 */
export function ForceManualControl(props: ParentProps) {
  return <ForceManualControlContext.Provider value={true}>
    {props.children}
  </ForceManualControlContext.Provider>
}
