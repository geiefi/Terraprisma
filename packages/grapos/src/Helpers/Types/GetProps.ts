import { JSX } from 'solid-js/jsx-runtime';

export type GetProps<Component> = Component extends (props: infer P) => JSX.Element
  ? P
  : never;
