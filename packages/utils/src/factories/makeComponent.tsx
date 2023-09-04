import {
  Component,
  ComponentProps,
  JSX,
  ValidComponent,
  createMemo,
  splitProps
} from 'solid-js';

import { AnyProps } from '../types';

export type ComponentFactory<
  AddedArgs extends any[],
  AbstractedProps extends AnyProps,
  ReceivingProps extends AbstractedProps
> = (resultingProps: ReceivingProps) => {
  abstractedProps: AbstractedProps;
  addedArgs: AddedArgs;
};

type GenericComponentFactory = ComponentFactory<any, any, any>;

/**
 * @description Recursevily merges all of the props of the resulting factories into one
 * taking priority from the first to last.
 */
type ResultingFactoriesProps<Factories extends GenericComponentFactory[]> =
  Factories extends [
    infer FirstFactory extends GenericComponentFactory,
    ...infer Rest extends GenericComponentFactory[]
  ]
    ? FirstFactory extends ComponentFactory<any, any, infer ResultingProps>
      ? Rest extends []
        ? ResultingProps
        : ResultingProps &
            Omit<ResultingFactoriesProps<[...Rest]>, keyof ResultingProps>
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
  Factory extends ComponentFactory<any, infer OProps, infer AddedProps>
    ? OProps & AddedProps
    : never;

type GetOriginalProps<FirstFactory extends GenericComponentFactory> =
  FirstFactory extends ComponentFactory<any, infer OProps, any>
    ? OProps
    : never;

export function makeComponents<
  Factory1 extends GenericComponentFactory,
  Factories extends [Factory1] = [Factory1],
  OriginalProps extends AnyProps = GetOriginalProps<Factory1>,
  ResultingProps extends
    ResultingFactoriesProps<Factories> = ResultingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): Component<ResultingProps>;
export function makeComponents<
  Factory1 extends GenericComponentFactory,
  Factory2 extends ComponentFactory<any, PropsAfter<Factory1>, any>,
  Factories extends [Factory1, Factory2] = [Factory1, Factory2],
  OriginalProps extends AnyProps = GetOriginalProps<Factory1>,
  ResultingProps extends
    ResultingFactoriesProps<Factories> = ResultingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1, Factory2],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): Component<ResultingProps>;
export function makeComponents<
  Factory1 extends GenericComponentFactory,
  Factory2 extends ComponentFactory<any, PropsAfter<Factory1>, any>,
  Factory3 extends ComponentFactory<any, PropsAfter<Factory2>, any>,
  Factories extends [Factory1, Factory2, Factory3] = [
    Factory1,
    Factory2,
    Factory3
  ],
  OriginalProps extends AnyProps = GetOriginalProps<Factory1>,
  ResultingProps extends
    ResultingFactoriesProps<Factories> = ResultingFactoriesProps<Factories>,
  ResultingArgs extends
    ResultingFactoriesArgs<Factories> = ResultingFactoriesArgs<Factories>
>(
  factories: [Factory1, Factory2, Factory3],
  abstractedComponent: (
    props: OriginalProps,
    ...args: ResultingArgs
  ) => JSX.Element
): Component<ResultingProps>;

/**
 * @description A function that is used to manage and generate a proper component following
 * design patterns much easily based on a factory pattern. This function computes the proper types,
 * arguments and the props based on the factories you have.
 *
 * Currently the only way to have this is by adding a function override for each amount of factories
 * possible, so just add a new one if you need more factories.
 */
export function makeComponents(
  factories: GenericComponentFactory[],
  abstractedComponent: (props: AnyProps, ...args: any) => JSX.Element
): Component<AnyProps> {
  return (resultingProps) => {
    let [cursorProps, accumulatedArgs] = [
      resultingProps as AnyProps,
      [] as any[]
    ];
    for (const cursorFactory of factories) {
      let { abstractedProps, addedArgs } = cursorFactory(cursorProps);
      cursorProps = abstractedProps;
      accumulatedArgs = [...accumulatedArgs, ...addedArgs];
    }
    const renderedElement = createMemo(() =>
      abstractedComponent(cursorProps, ...accumulatedArgs)
    );

    return <>{renderedElement()}</>;
  };
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
