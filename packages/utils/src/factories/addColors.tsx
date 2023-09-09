import type { PossibleColors, Theme } from '@grapos/core';

import { createComponentFactory } from './makeComponent';

import type { AnyProps } from '../types';
import { createMemo, splitProps } from 'solid-js';

export const addColors = <Props extends AnyProps, Themes extends Theme[]>(
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
