import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function forwardNativeElementProps<
Props extends Record<string, any>,
ElementType extends HTMLElement, 
ElementProps extends JSX.HTMLAttributes<ElementType>
  = JSX.HTMLAttributes<ElementType>,
PropsToTake extends (keyof Props)[] = (keyof Props)[],
>(
  componentFunc: (
    props: Props, 
    elProps: Omit<ElementProps, PropsToTake[number]>
  ) => JSX.Element,
  componentPropNames: PropsToTake,
): (allProps: Props & Omit<ElementProps, PropsToTake[number]>) => JSX.Element {
  return (allProps: Props & Omit<ElementProps, PropsToTake[number]>) => componentFunc(
    ...(splitProps(allProps, componentPropNames) as unknown as [Props, Omit<ElementProps, PropsToTake[number]>])
  );
}