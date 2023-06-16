import { Component, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function forwardNativeElementProps<Props extends Record<string, any>, ElementType extends HTMLElement>(
  componentFunc: (props: Props, elProps: Omit<JSX.HTMLAttributes<ElementType>, keyof Props>) => JSX.Element | JSX.Element[],
  componentPropNames: [keyof Props] | (keyof Props)[],
): Component<Props & JSX.HTMLAttributes<ElementType>> {
  return (allProps: Props & JSX.HTMLAttributes<ElementType>) => componentFunc(
    ...splitProps(allProps, componentPropNames)
  );
}

