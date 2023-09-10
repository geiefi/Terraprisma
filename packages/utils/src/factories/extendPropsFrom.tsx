import { ComponentProps, ValidComponent, splitProps } from 'solid-js';

import { createComponentFactory } from './makeComponent';

import type { AnyProps } from '../types';

export const extendPropsFrom = <
  Props extends AnyProps,
  Comp extends ValidComponent,
  CompProps extends ComponentProps<Comp> = ComponentProps<Comp>
>(
  propKeys: (keyof Props)[]
) => {
  return createComponentFactory<
    Props,
    Props & Omit<CompProps, keyof Props>
  >().setup((allProps) => {
    const [props, extendedProps] = splitProps(allProps, propKeys);

    return {
      abstractedProps: props,
      addedArgs: [extendedProps as Omit<CompProps, keyof Props>]
    };
  });
};
