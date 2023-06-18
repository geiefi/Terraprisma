type Func = ((...args: any[]) => any) & {
  (...args: any[]): any
};

export function mergeCallbacks<Callback extends Func>(...callbacks: [...(Callback | undefined)[], Callback]): Callback {
  return ((...args: any[]) => {
    for (const callback of callbacks.slice(0, -1)) {
      if (typeof callback === 'function') {
        callback(...args);
      }
    }

    const lastCallback = callbacks[callbacks.length - 1];
    if (typeof lastCallback === 'function') {
      return lastCallback(...args);
    } else {
      throw new Error(
        'It seems the last callback is not a function, but it is required since it determines the return of the merged callbacks!'
      );
    }
  }) as Callback;
}
