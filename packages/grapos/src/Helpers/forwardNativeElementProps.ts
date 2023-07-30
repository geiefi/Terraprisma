import { Component, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function forwardNativeElementProps<
Props extends Record<string, any>, 
ElementType extends HTMLElement, 
PropsToIgnore extends (keyof Props)[] = (keyof Props)[],
ElementProps extends JSX.HTMLAttributes<ElementType> 
  = JSX.HTMLAttributes<ElementType>,
ResultingComponentProps extends Props & Omit<ElementProps, PropsToIgnore[number]> 
  = Props & Omit<ElementProps, PropsToIgnore[number]>,
>(
  componentFunc: (
    props: Props, 
    elProps: Omit<ElementProps, PropsToIgnore[number]>
  ) => JSX.Element,
  componentPropNames: PropsToIgnore,
): Component<ResultingComponentProps> {
  return (allProps: ResultingComponentProps) => componentFunc(
    ...(splitProps(allProps, componentPropNames) as unknown as [Props, Omit<ElementProps, PropsToIgnore[number]>])
  );
}