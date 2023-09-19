import { createMemo, splitProps } from 'solid-js';

import { createComponentFactory, AnyProps } from '@terraprisma/utils';
import { Accents } from '@terraprisma/theming';

export const addAccentColoring = <Props extends AnyProps>(
  defaultColor: Accents = 'accent'
) => {
  return createComponentFactory<Props, Props & { color?: Accents }>().setup(
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
