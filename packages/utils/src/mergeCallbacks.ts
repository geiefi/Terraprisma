import { createMemo } from "solid-js";

type BoundCallback<Data, Args extends any[], ReturnType> = {
  1: Data;
  0: (data: Data, ...args: Args) => ReturnType;
};

type Callback<Args extends any[], ReturnType = void> =
  | ((...args: Args) => ReturnType)
  | BoundCallback<any, Args, ReturnType>;

function isCallbackBound<Args extends any[], ReturnType>(
  callback: Callback<Args, ReturnType> | undefined
): callback is BoundCallback<any, Args, ReturnType> {
  return Array.isArray(callback) ? true : false;
}

/**
 * @description Does the same as `mergeClass` but with callbacks.
 * This allows for either a BoundCallback (see [here](https://www.solidjs.com/tutorial/bindings_events)) or a
 * normal callback as a function with any parameters. Just like `mergeClass` it only considers truthy values, but will
 * not allow the last one to not be truthy as that would break the callbacks.
 *
 * So that this function is more generic, the code will actually throw an error if the last function is undefined
 * or not a function overall since it will be needed if the callbacks have a return type.
 *
 * @returns A new callback that will return the value of the last callback it was called with,
 * and go through all of the callbcks proxying its received parameters into all of them.
 *
 * @example
 * ```jsx
 * const MyComponent = (props) => {
 *   return <button onClick={mergeCallbacks(
 *     () => console.log('clicked!'),
 *     props.onClick,
 *   )}>Click me man!</button>
 * };
 * ```
 */
export function mergeCallbacks<Args extends any[], ReturnType = void>(
  ...callbacks: (Callback<Args, ReturnType> | undefined)[]
): (...args: Args) => (ReturnType | undefined) {
  const callbacksToCallMem = createMemo(() => callbacks
    .filter(Boolean)
    .map((callback) =>
      isCallbackBound(callback)
        ? (...args: any) => callback[0](callback[1], ...args)
        : callback!
    ));

  return (...args: Args) => {
    const callbacksToCall = callbacksToCallMem();
    if (callbacksToCall.length === 0) return;

    for (const callback of callbacksToCall.slice(0, -1)) {
      callback(...args);
    }

    return callbacksToCall[callbacksToCall.length - 1](...args);
  };
}
