import { createMemo, splitProps } from 'solid-js';

import { createComponentFactory, AnyProps } from '@terraprisma/utils';

import { AccentColors } from '../themes';

export type AccentColor = AccentColors<Themes[number]>;

export const addAccentColoring = <Props extends AnyProps>(
  defaultColor: AccentColor = 'accent'
) => {
  return createComponentFactory<Props, Props & { color?: AccentColor }>().setup(
    (allProps) => {
      const [colorObj, props] = splitProps(allProps, ['color']);

      const color = createMemo(() => colorObj.color || defaultColor);

      return {
        abstractedProps: props as Props,
        addedArgs: [color]
      };
    }
  );
};
