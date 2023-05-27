import { Component, JSX, ParentProps, splitProps } from "solid-js";

export interface ColProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
    | 22 | 23 | 24;

  style?: JSX.CSSProperties;
};

const Col: Component<ColProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['size']);

  return <div 
    {...elProps}
    style={{ 
      width: `${props.size / 24 * 100}%`,
      ...elProps.style
    }}
  >
    {elProps.children}
  </div>;
};

export default Col;
