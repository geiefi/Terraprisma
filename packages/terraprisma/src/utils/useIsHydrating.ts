import { createSignal, sharedConfig } from "solid-js";

export function useIsHydrating() {
  const getIsHydrating = () => !!sharedConfig.context;

  const [isHydrating, setIsHydrating] = createSignal(getIsHydrating());

  function updateUntilHydrationIsFinished() {
    dbg('updating to check if hydration is finished');
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
