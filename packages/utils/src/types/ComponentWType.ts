import { JSX } from 'solid-js/jsx-runtime';
import { AnyProps } from './AnyProps';

export type ComponentWType<Props extends AnyProps, T = any> = <_Type extends T>(
  props: Props
) => JSX.Element;
