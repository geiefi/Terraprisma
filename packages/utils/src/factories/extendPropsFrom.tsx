import { ComponentProps, ValidComponent, splitProps } from 'solid-js';

import type { AnyProps } from '../types';
import type { ComponentFactory } from './componentBuilder';

export function extendPropsFrom<
  BaseProps extends AnyProps,
  ExtendFrom extends ValidComponent
>(keys: (keyof BaseProps)[]) {
  return ((propsIntoFactory: BaseProps & ComponentProps<ExtendFrom>) => {
    const [props, elProps] = splitProps(propsIntoFactory, keys);

    return {
      baseProps: props as BaseProps,
      args: [elProps] as [ComponentProps<ExtendFrom>]
    };
  }) satisfies ComponentFactory<
    BaseProps,
    BaseProps & ComponentProps<ExtendFrom>,
    [elProps: ComponentProps<ExtendFrom>]
  >;
}
