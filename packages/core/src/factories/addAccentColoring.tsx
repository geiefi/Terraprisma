import { Accessor, createMemo, splitProps } from 'solid-js';

import { AnyProps } from '@terraprisma/utils';

import type { Accents } from '..';
import type { ComponentFactory } from '@terraprisma/utils';

export const addAccentColoring = <BaseProps extends AnyProps>(
  defaultColor: Accents = 'accent'
) => {
  return ((propsIntoFactory: BaseProps & { color?: Accents }) => {
    const [colorObj, props] = splitProps(propsIntoFactory, ['color']);

    const color = createMemo(() => colorObj.color || defaultColor);

    return {
      baseProps: props as BaseProps,
      args: [color] as [Accessor<Accents>]
    };
  }) satisfies ComponentFactory<
    BaseProps,
    BaseProps & { color: Accents },
    [Accessor<Accents>]
  >;
};
