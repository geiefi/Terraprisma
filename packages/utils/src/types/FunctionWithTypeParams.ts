import { JSX } from 'solid-js/jsx-runtime';
import { AnyProps } from './AnyProps';

export type ComponentWithTypeParams<
  Props extends AnyProps,
  TParams extends any[]
> = FunctionWithTypeParams<[Props], JSX.Element, TParams>;

export type FunctionWithTypeParams<
  Args extends any[],
  ReturnType extends any,
  TParams extends any[]
> = Omit<
  TParams extends []
    ? {
        (...args: Args): ReturnType;
        _TypeParameters: TParams;
      }
    : TParams extends [infer A]
    ? {
        <_T1 extends A>(...args: Args): ReturnType;
        _TypeParameters: TParams;
      }
    : TParams extends [infer A, infer B]
    ? {
        <_T1 extends A, _T2 extends B>(...args: Args): ReturnType;
        _TypeParameters: TParams;
      }
    : TParams extends [infer A, infer B, infer C]
    ? {
        <_T1 extends A, _T2 extends B, _T3 extends C>(
          ...args: Args
        ): ReturnType;
        _TypeParameters: TParams;
      }
    : never,
  '_TypeParameters' // having this property is the only to allow typescript to actually infer the type paremeters
>;
