import { createMemo, splitProps } from 'solid-js';

import { createComponentFactory } from './makeComponent';

import type { AnyProps, PossibleColors } from '../types';

export const addColors = <Props extends AnyProps>(
  defaultColor: PossibleColors<Themes[number]> = 'accent'
) => {
  return createComponentFactory<
    Props,
    Props & { color?: PossibleColors<Themes[number]> }
  >().setup((allProps) => {
    const [colorObj, props] = splitProps(allProps, ['color']);

    const color = createMemo(() => colorObj.color || defaultColor);

    return {
      abstractedProps: props as Props,
      addedArgs: [color]
    };
  });
};
