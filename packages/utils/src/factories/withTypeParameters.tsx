import { JSX } from 'solid-js';

import { AnyProps } from '../types';
import { Dynamic } from 'solid-js/web';
import { FunctionWithTypeParams } from '../types/FunctionWithTypeParams';

type WithTypeParameters = <TypeParams extends any[]>() => {
  transform<Props extends AnyProps, PreviousTParams extends any[]>(
    func: FunctionWithTypeParams<
      [],
      FunctionWithTypeParams<[props: Props], JSX.Element, PreviousTParams>, // the resulting component
      TypeParams
    >
  ): FunctionWithTypeParams<
    [props: Props],
    JSX.Element,
    [...TypeParams, ...PreviousTParams]
  >;
};

/**
 * @description Helps create components that receive the type parameter of the Themes into it.
 */
export const withTypeParameters: WithTypeParameters = ((func: () => any) =>
  (props: AnyProps) => <Dynamic component={func()} {...props} />) as any;
