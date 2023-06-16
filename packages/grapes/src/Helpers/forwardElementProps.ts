import { Component, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function forwardNativeElementProps<Props extends Record<string, any>, ElementType extends HTMLElement>(
  componentFunc: (props: Props, elProps: JSX.HTMLAttributes<ElementType>) => JSX.Element | JSX.Element[],
  componentPropNames: [keyof Props] | (keyof Props)[],
): Component<JSX.HTMLAttributes<ElementType> & Props> {
  return (allProps: JSX.HTMLAttributes<ElementType> & Props) => componentFunc(
    ...splitProps(allProps, componentPropNames)
  );
}

