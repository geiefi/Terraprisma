import { Component, JSX, ParentProps, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { AnyProps } from '../types';
import { ComponentWithTypeParams } from '../types/FunctionWithTypeParams';

type Wrapper = (props: ParentProps) => JSX.Element;
export type ComponentFactory<
  AddedArgs extends any[],
  AbstractedProps extends AnyProps,
  ReceivingProps extends AbstractedProps
> = (resultingProps: ReceivingProps) => {
  wrapper?: Wrapper;
  abstractedProps: AbstractedProps;
  addedArgs: AddedArgs;
};

export type GenericComponentFactory = ComponentFactory<any, any, any>;

/**
 * @description Recursevily merges all of the props of the resulting factories into one
 * taking priority from the first to last.
 */
type ReceiveingFactoriesProps<Factories extends GenericComponentFactory[]> =
  Factories extends [
    infer FirstFactory extends GenericComponentFactory,
    ...infer Rest extends GenericComponentFactory[]
  ]
    ? FirstFactory extends ComponentFactory<any, any, infer ReceivingProps>
      ? Rest extends []
        ? ReceivingProps
        : ReceivingProps &
            Omit<ReceiveingFactoriesProps<[...Rest]>, keyof ReceivingProps>
      : never
    : never;

type ResultingFactoriesArgs<Factories extends GenericComponentFactory[]> =
  Factories extends [
    infer FirstFactory,
    ...infer Rest extends GenericComponentFactory[]
  ]
    ? FirstFactory extends ComponentFactory<infer AddedArgs, any, any>
      ? Rest extends []
        ? AddedArgs
        : [...AddedArgs, ...ResultingFactoriesArgs<[...Rest]>]
      : never
    : never;

type PropsAfter<Factory extends GenericComponentFactory> =
  Factory extends ComponentFactory<any, any, infer ReceivingProps>
    ? ReceivingProps
    : never;

type GetAbstractedProps<FirstFactory extends GenericComponentFactory> =
  FirstFactory extends ComponentFactory<any, infer AbstractedProps, any>
    ? AbstractedProps
    : never;

export function makeComponent<
  Factory1 extends GenericComponentFactory,
  Factories extends [Factory1] = [Factory1],
  OriginalProps extends AnyProps = GetAbstractedProps<Factory1>,
  ResultingProps extends
    ReceiveingFactoriesProps<Factories> = ReceiveingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): Component<ResultingProps>;
export function makeComponent<
  Factory1 extends GenericComponentFactory,
  Factory2 extends ComponentFactory<any, PropsAfter<Factory1>, any>,
  Factories extends [Factory1, Factory2] = [Factory1, Factory2],
  OriginalProps extends AnyProps = GetAbstractedProps<Factory1>,
  ResultingProps extends
    ReceiveingFactoriesProps<Factories> = ReceiveingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1, Factory2],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): Component<ResultingProps>;
export function makeComponent<
  Factory1 extends GenericComponentFactory,
  Factory2 extends ComponentFactory<any, PropsAfter<Factory1>, any>,
  Factory3 extends ComponentFactory<any, PropsAfter<Factory2>, any>,
  Factories extends [Factory1, Factory2, Factory3] = [
    Factory1,
    Factory2,
    Factory3
  ],
  OriginalProps extends AnyProps = GetAbstractedProps<Factory1>,
  ResultingProps extends
    ReceiveingFactoriesProps<Factories> = ReceiveingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1, Factory2, Factory3],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): ComponentWithTypeParams<ResultingProps, []>;

/**
 * @description A function that is used to manage and generate a proper component following
 * design patterns much easily based on a factory pattern. This function computes the proper types,
 * arguments and the props based on the factories you have.
 *
 * Currently the only way to have this is by adding a function override for each amount of factories
 * possible, so just add a new one if you need more factories.
 */
export function makeComponent(
  factories: GenericComponentFactory[],
  abstractedComponent: (props: AnyProps, ...args: any) => JSX.Element
): Component<AnyProps> {
  return (resultingProps) => {
    let [cursorProps, accumulatedArgs] = [
      resultingProps as AnyProps,
      [] as any[]
    ];
    const wrappers: Array<(props: ParentProps) => JSX.Element> = [];
    for (const cursorFactory of factories) {
      let { abstractedProps, addedArgs, wrapper } = cursorFactory(cursorProps);
      if (wrapper) {
        wrappers.push(wrapper);
      }
      cursorProps = abstractedProps;
      accumulatedArgs = [...accumulatedArgs, ...addedArgs];
    }

    return wrap(
      <Dynamic
        component={(p: { cursorProps: AnyProps; accumulatedArgs: any[] }) =>
          abstractedComponent(p.cursorProps, ...p.accumulatedArgs)
        }
        cursorProps={cursorProps}
        accumulatedArgs={accumulatedArgs}
      />,
      wrappers
    );
  };
}

function wrap(element: JSX.Element, wrappers: Wrapper[]): JSX.Element {
  if (wrappers.length === 0) {
    return element;
  }

  return (
    <Dynamic
      component={wrappers[0]}
      children={wrap(element, wrappers.slice(1))}
    />
  );
}

/**
 * @description A utility function to facilitate the creation of component factories.
 * Be careful with the returned abstractedProps though since TypeScript doesn't check the types
 * equality so well here.
 *
 * @returns A builder object with a setup function which is used to infer the factory's added arguments.
 */
export function createComponentFactory<
  AbstractedProps extends AnyProps,
  ReceivingProps extends AbstractedProps
>() {
  return {
    setup<AddedArgs extends any[] = []>(
      factory: ComponentFactory<[...AddedArgs], AbstractedProps, ReceivingProps>
    ): ComponentFactory<[...AddedArgs], AbstractedProps, ReceivingProps> {
      return factory;
    }
  };
}
