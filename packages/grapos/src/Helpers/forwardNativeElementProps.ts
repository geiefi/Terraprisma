import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

/**
 * @description Forwards all native props of an element and automatically
 * splits them for the underlying component.
 * Takes priority for the props you provide instead of for the element's props.
 *
 * @returns A new component with the Props & ElProps intertwined taking priority over the Props,
 * such that the resulting component's props is equivalent to Props & Omit<ElProps, keyof Props>.
 *
 * @param componentFunc The component that you actually want the elemnt props
 * forwarded to.
 *
 * @param componentPropNames All of the keys of {@link Props} for splitting. Sadly
 * this parameter is a limitation of this helper. Maybe can be fixed with ts-transformers though.
 */
export function forwardNativeElementProps<
  Props extends Record<string, any>,
  ElementType extends HTMLElement,
  ElementProps extends
    JSX.HTMLAttributes<ElementType> = JSX.HTMLAttributes<ElementType>,
  PropsToTake extends (keyof Props)[] = (keyof Props)[],
>(
  componentFunc: (
    props: Props,
    elProps: Omit<ElementProps, PropsToTake[number]>,
  ) => JSX.Element,
  componentPropNames: PropsToTake,
): (allProps: Props & Omit<ElementProps, PropsToTake[number]>) => JSX.Element {
  return (allProps: Props & Omit<ElementProps, PropsToTake[number]>) =>
    componentFunc(
      ...(splitProps(allProps, componentPropNames) as unknown as [
        Props,
        Omit<ElementProps, PropsToTake[number]>,
      ]),
    );
}
