import { ComponentProps, JSX, splitProps } from 'solid-js';
import { mergeClass } from '../../utils';
import { LeftIntersection } from '../../types/LeftIntersection';

export type IconProps = LeftIntersection<
  {
    /**
     * Outlined by default
     */
    variant?: 'outlined' | 'rounded' | 'sharp';

    style?: JSX.CSSProperties;
  },
  ComponentProps<'span'>
>;

export type IconComponent = ReturnType<typeof createIconComponent>;

// not a decorator
const createIconComponent = (iconName: string) => {
  return (allProps: IconProps) => {
    const [props, elProps] = splitProps(allProps, ['variant', 'style', 'children']);
    return <span
      {...elProps}
      class={mergeClass(
        `material-symbols-${props.variant || 'outlined'}`,
        elProps.class
      )}
      style={{
        'font-size': 'inherit',
        scale: '1.4',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        ...props.style
      }}
    >
      {iconName}
    </span>;
  };
};

export default createIconComponent;
