type BoundsEventHandler<Data, EventType extends Event> = {
  1: Data;
  0: (data: Data, event: EventType) => any;
};

type EventHandler<EventType extends Event> =
  | ((event: EventType) => any)
  | BoundsEventHandler<any, EventType>;

function isCallbackBound<EventType extends Event>(
  callback: EventHandler<EventType> | undefined
): callback is BoundsEventHandler<any, EventType> {
  return Array.isArray(callback) ? true : false;
}

/**
 * @description Does the same as `mergeClass` but with callbacks.
 * This allows for either a BoundCallback (see [here](https://www.solidjs.com/tutorial/bindings_events)) or a
 * normal callback as a function with any parameters. Just like `mergeClass` it only considers truthy values.
 *
 * This function will merge each event and map them all first as to not call the callback if the immediate propagation
 * on the event has stopped.
 *
 * @returns A new callback that will return the value of the last callback it was called with,
 * and go through all of the callbcks proxying its received parameters into all of them.
 *
 * @example
 * ```jsx
 * const MyComponent = (props) => {
 *   return <button onClick={mergeEventHandlers(
 *     () => console.log('clicked!'),
 *     props.onClick,
 *   )}>Click me man!</button>
 * };
 * ```
 */
export function mergeEventHandlers<EventType extends Event>(
  ...callbacks: (EventHandler<EventType> | undefined)[]
): (event: EventType) => any {
  const handlerCallbacks = callbacks
    .filter(Boolean)
    .map((callback) => {
      if (isCallbackBound(callback)) {
        return (event: EventType) => callback[0](callback[1], event)
      } else {
        return callback!;
      }
    });

  return (event) => {
    if (handlerCallbacks.length === 0) return;

    let stoppedImmediatePropagation = false;

    const modifiedEvent = structuredClone(event);
    modifiedEvent.stopImmediatePropagation = (() => {
      const actuallyStopImmediatePropagation = event.stopImmediatePropagation;

      return () => {
        stoppedImmediatePropagation = true;

        actuallyStopImmediatePropagation.bind(event);
      };
    })();

    for (const handler of handlerCallbacks) {
      handler(modifiedEvent);

      if (stoppedImmediatePropagation) {
        break;
      }
    }
  };
}
