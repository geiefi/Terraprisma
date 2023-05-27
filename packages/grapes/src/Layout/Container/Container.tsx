import { Component, createMemo, JSX, ParentProps, splitProps } from "solid-js";
import { mergeClass } from "../../_Shared/Utils";

import './Container.scss';

export type LayoutWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement> {
  horizontalAlign?: 'center' | 'left' | 'right';
  verticalAlign?: 'center' | 'top' | 'bottom';
  style?: JSX.CSSProperties;
  maxWidth?: LayoutWidth | number;
}

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

const Container: Component<ContainerProps> = (allProps) => {
  const [props, elProps] = splitProps(allProps, ['horizontalAlign', 'verticalAlign', 'style', 'maxWidth']);

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
    {...elProps}
    class={mergeClass('container', elProps.class)}
    style={{
      'justify-content': props.verticalAlign,
      'align-items': props.horizontalAlign,
      "max-width": maxWidthPx(),
      ...props.style
    }}
  >
    {elProps.children}
  </div>;
};

export default Container;
