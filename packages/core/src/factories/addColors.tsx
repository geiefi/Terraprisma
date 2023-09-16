import { createMemo, splitProps } from 'solid-js';

import { createComponentFactory, AnyProps } from '@terraprisma/utils';

import { PossibleColors } from '../themes';

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
