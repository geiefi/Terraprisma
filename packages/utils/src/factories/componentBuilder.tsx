import { JSX } from 'solid-js';

import type { AnyProps } from '../types';

export type ComponentFactory<
  BaseProps extends AnyProps,
  PropsIntoFactory extends BaseProps,
  Args extends any[]
> = (propsIntoFactory: PropsIntoFactory) => {
  baseProps: BaseProps;
  args: [...Args];
};

type AnyFactory = ComponentFactory<any, any, any>;

type PropsAfter<Factory extends AnyFactory> = Factory extends ComponentFactory<
  any,
  infer PropsIntoFactory extends AnyProps,
  any
>
  ? PropsIntoFactory
  : never;

type PropsAfterOrBase<
  BaseProps extends AnyProps,
  Factories extends AnyFactory[]
> = Factories extends [
  ...infer _,
  infer Last extends ComponentFactory<any, any, any>
]
  ? PropsAfter<Last>
  : BaseProps;

type ArgsAfterAll<
  Factories extends AnyFactory[],
  BaseArgs extends any[] = []
> = [...Factories] extends [
  infer First extends AnyFactory,
  ...infer Rest extends AnyFactory[]
]
  ? First extends ComponentFactory<any, any, infer Args extends any[]>
    ? [] extends Rest
      ? [...BaseArgs, ...Args]
      : ArgsAfterAll<Rest, [...BaseArgs, ...Args]>
    : never
  : [];

export class ComponentBuilder<
  BaseProps extends AnyProps,
  Factories extends AnyFactory[],
  PropsForNextFactory extends PropsAfterOrBase<
    BaseProps,
    [...Factories]
  > = PropsAfterOrBase<BaseProps, [...Factories]>,
  ArgsForAbstractedComponent extends ArgsAfterAll<
    [...Factories]
  > = ArgsAfterAll<[...Factories]>
> {
  constructor(public factories: [...Factories]) {}

  factory<Factory extends ComponentFactory<PropsForNextFactory, any, any>>(
    factory: Factory
  ) {
    this.factories.push(factory);

    return this as unknown as ComponentBuilder<
      BaseProps,
      [...Factories, Factory]
    >;
  }

  create(
    abstractedComponent: (
      props: BaseProps,
      ...args: ArgsForAbstractedComponent
    ) => JSX.Element
  ): {
    (props: PropsForNextFactory): JSX.Element;
    [compoundedComponentName: string]: any;
  } {
    return (propsIntoFirstFactory: PropsForNextFactory) => {
      let [propsIntoNextFactory, accumulatedArgs] = [
        propsIntoFirstFactory as AnyProps,
        [] as any[]
      ];

      for (const cursorFactory of this.factories) {
        let { baseProps, args } = cursorFactory(propsIntoNextFactory);

        propsIntoNextFactory = baseProps;
        accumulatedArgs = [...accumulatedArgs, ...args];
      }

      // at this point these are the baseProps;
      const baseProps = propsIntoNextFactory as BaseProps;
      const args = accumulatedArgs as ArgsForAbstractedComponent;

      return abstractedComponent(baseProps, ...args);
    };
  }
}

export function componentBuilder<BaseProps extends AnyProps>() {
  return new ComponentBuilder<BaseProps, []>([]);
}
