import { createSignal, sharedConfig } from "solid-js";
import { isServer } from "solid-js/web";

export function useIsHydrating() {
  if (isServer) return () => false;

  const getIsHydrating = () => !!sharedConfig.context;

  const [isHydrating, setIsHydrating] = createSignal(getIsHydrating());

  function updateUntilHydrationIsFinished() {
    if (getIsHydrating()) {
      // wait until the call stack ends
      // which will probably be after the hydration is finished
      // as Solid is synchronous
      setTimeout(() => {
        updateUntilHydrationIsFinished();
      }, 0);
    } else {
      setIsHydrating(false);
    }
  }

  // eslint-disable-next-line solid/reactivity
  if (isHydrating() === true) {
    updateUntilHydrationIsFinished();
  }

  return isHydrating;
}
