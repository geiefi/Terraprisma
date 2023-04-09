import { Component, createMemo, JSX, ParentProps } from "solid-js";
import Stack from "../Stack/Stack";

import './Container.scss';

export type LayoutWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ContainerProps = ParentProps<{
  horizontalAlign?: 'center' | 'left' | 'right';
  verticalAlign?: 'center' | 'top' | 'bottom';
  style?: JSX.CSSProperties;
  maxWidth?: LayoutWidth | number;
}>;

export const layoutWidths: Record<LayoutWidth, string> = {
  'xs': '576px',
  'sm': '768px',
  'md': '992px',
  'lg': '1200px',
  'xl': '1920px'
};

function isPredefinedLayoutWidth(maxWidth: any): maxWidth is LayoutWidth {
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(maxWidth);
}

const Container: Component<ContainerProps> = (props) => {
  const maxWidthPx = createMemo<string>(() => {
    const maxWidth = props.maxWidth || 'lg';

    if (isPredefinedLayoutWidth(maxWidth)) {
      return layoutWidths[maxWidth];
    }

    if (typeof maxWidth === 'number') {
      return maxWidth.toString() + 'px';
    }

    return maxWidth;
  });

  return <div 
    class='container'
    style={{
      'justify-content': props.verticalAlign,
      'align-items': props.horizontalAlign,
      "max-width": maxWidthPx(),
      ...props.style
    }}
  >
    {props.children}
  </div>;
};

export default Container;
