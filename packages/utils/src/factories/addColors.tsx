import type { PossibleColors, Theme } from '@grapos/core';

import { createComponentFactory } from './makeComponent';

import type { AnyProps } from '../types';
import { createMemo, splitProps } from 'solid-js';

export const addColors = <Props extends AnyProps, Themes extends Theme[]>() => {
  return createComponentFactory<
    Props,
    Props & { color?: PossibleColors<Themes> }
  >().setup((allProps) => {
    const [colorObj, props] = splitProps(allProps, ['color']);

    const color = createMemo(() => colorObj.color || 'accent');

    return {
      abstractedProps: props as Props,
      addedArgs: [color]
    };
  });
};
