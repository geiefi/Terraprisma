import { ComponentProps, JSX, ParentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../utils';

export type LayoutWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends ParentProps, ComponentProps<'div'> {
  horizontalAlign?: 'center' | 'left' | 'right';
  verticalAlign?: 'center' | 'top' | 'bottom';
  style?: JSX.CSSProperties;
  maxWidth?: LayoutWidth;
}

const Container = (allProps: ContainerProps) => {
  const [props, elProps] = splitProps(allProps, [
    'horizontalAlign',
    'verticalAlign',
    'style',
    'maxWidth',
    'children'
  ]);
  return (
    <div
      {...elProps}
      class={mergeClass(
        'tp-container tp-mx-auto',
        (props.horizontalAlign || props.verticalAlign) && 'tp-flex tp-flex-col',
        props.maxWidth === 'xs' && '!tp-max-w-full',
        props.maxWidth === 'sm' && '!tp-max-w-[640px]',
        props.maxWidth === 'md' && '!tp-max-w-[768px]',
        props.maxWidth === 'md' && '!tp-max-w-[1024px]',
        props.maxWidth === 'lg' && '!tp-max-w-[1280px]',
        props.maxWidth === 'xl' && '!tp-max-w-[1536px]',
        elProps.class
      )}
      style={{
        'justify-content': props.horizontalAlign,
        'align-items': props.verticalAlign,
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
};

export default Container;
