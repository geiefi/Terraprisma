/* eslint-disable */
import type { Component, ComponentProps, JSX } from 'solid-js';
import {
  createMemo,
  createSignal,
  onMount,
  sharedConfig,
  splitProps,
  untrack
} from 'solid-js';

import { isServer } from 'solid-js/web';

// not using Suspense
function clientOnly<T extends Component<any>>(
  fn: () => Promise<T>
) {
  if (isServer)
    return (props: ComponentProps<T> & { fallback?: JSX.Element }) =>
      props.fallback;

  const [comp, setComp] = createSignal<T>();
  fn().then((component) => setComp(() => component));
  return (props: ComponentProps<T>) => {
    let Comp: T | undefined;
    let m: boolean;
    const [, rest] = splitProps(props, ['fallback']);
    if ((Comp = comp()) && !sharedConfig.context) return Comp(rest);
    const [mounted, setMounted] = createSignal(!sharedConfig.context);
    onMount(() => setMounted(true));
    return createMemo(
      () => (
        (Comp = comp()),
        (m = mounted()),
        untrack(() => (Comp && m ? Comp(rest) : props.fallback))
      )
    );
  };
}

export const SafePortal = clientOnly(() =>
  import('solid-js/web').then((m) => m.Portal)
);

