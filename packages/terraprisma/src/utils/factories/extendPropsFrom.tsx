import { ComponentProps, ValidComponent, splitProps } from 'solid-js';

import type { AnyProps } from '../../types';
import type { ComponentFactory } from './componentBuilder';

export function extendPropsFrom<
  BaseProps extends AnyProps,
  ExtendFrom extends ValidComponent,
  ElementProps extends Omit<ComponentProps<ExtendFrom>, keyof BaseProps> = Omit<
    ComponentProps<ExtendFrom>,
    keyof BaseProps
  >
>(keys: (keyof BaseProps)[]) {
  return ((propsIntoFactory: BaseProps & ElementProps) => {
    const [props, elProps] = splitProps(propsIntoFactory, keys);

    return {
      baseProps: props as BaseProps,
      args: [elProps] as unknown as [ElementProps]
    };
  }) satisfies ComponentFactory<
    BaseProps,
    BaseProps & ElementProps,
    [elProps: ElementProps]
  >;
}
