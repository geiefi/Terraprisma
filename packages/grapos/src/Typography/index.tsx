import { ParentProps } from "solid-js";

import { forwardNativeElementProps } from "../Helpers";

import Title from "./Title";
import Paragraph from "./Paragraph";
import Code from "./Code";

export interface TypographyProps extends ParentProps {
}

const Typography = forwardNativeElementProps<TypographyProps, HTMLElement>(
  (props, elProps) => {
    return <article {...elProps}>
      {props.children}
    </article>;
  }, 
  ['children']
);

export { Typography, Paragraph, Title, Code };