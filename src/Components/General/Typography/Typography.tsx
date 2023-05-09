import type { Component, ParentProps } from "solid-js"; 

import './Typography.scss';

export type TitleProps = ParentProps<{
  type: 1 | 2 | 3 | 4 | 5 | 6;
}>;


/**
 * @description To be used inside of a <Typography> component,
 * can be a <h1>, <h2>, <h3>, <h4>, <h5> and an <h6>.
 *
 * @example
 *
 * ```tsx
 * <Typography>
 *   <Title type={3}>This is a h3!</Title>
 * </Typography>
 * ```
 */
export const Title: Component<TitleProps> = (props) => {
  return <>
    {props.type === 1 && <h1>{props.children}</h1>}
    {props.type === 2 && <h2>{props.children}</h2>}
    {props.type === 3 && <h3>{props.children}</h3>}
    {props.type === 4 && <h4>{props.children}</h4>}
    {props.type === 5 && <h5>{props.children}</h5>}
    {props.type === 6 && <h6>{props.children}</h6>}
  </>;
};

export const Strong: Component<ParentProps> = (props) => {
  return <b>{props.children}</b>;
};

export const Paragraph: Component<ParentProps> = (props) => {
  return <p>{props.children}</p>;
};

const Typography: Component<ParentProps> = (props) => {
  return <div class='typography'>
    {props.children}
  </div>;
};

export default Typography;
