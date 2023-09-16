import { createMemo, JSX, ParentProps } from 'solid-js';

import { mergeClass, createComponentExtendingFromOther } from '@terraprisma/utils';

import './Container.scss';

export type LayoutWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends ParentProps {
  horizontalAlign?: 'center' | 'left' | 'right';
  verticalAlign?: 'center' | 'top' | 'bottom';
  style?: JSX.CSSProperties;
  maxWidth?: LayoutWidth | number;
}

const Container = createComponentExtendingFromOther<ContainerProps, 'div'>(
  (props, elProps) => {
    const layoutWidths: Record<LayoutWidth, string> = {
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1920px'
    };

    const isPredefinedLayoutWidth = (
      maxWidth: LayoutWidth | number
    ): maxWidth is LayoutWidth => {
      return ['xs', 'sm', 'md', 'lg', 'xl'].includes(maxWidth.toString());
    };

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

    return (
      <div
        {...elProps}
        class={mergeClass('container', elProps.class)}
        style={{
          'justify-content': props.verticalAlign,
          'align-items': props.horizontalAlign,
          'max-width': maxWidthPx(),
          ...props.style
        }}
      >
        {props.children}
      </div>
    );
  },
  ['horizontalAlign', 'verticalAlign', 'style', 'maxWidth', 'children']
);

export default Container;
