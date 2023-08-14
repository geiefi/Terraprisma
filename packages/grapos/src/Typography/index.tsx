import { ParentProps } from 'solid-js';

import { forwardNativeElementProps } from '../Helpers';

import Title from "./Title";
import Paragraph from "./Paragraph";

const Typography = forwardNativeElementProps<ParentProps, HTMLElement>(
  (props, elProps) => {
    return <article {...elProps}>
      {props.children}
    </article>;
  }, 
  ['children']
);

export { Typography, Paragraph, Title };