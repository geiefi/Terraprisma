import { JSX, ParentProps } from 'solid-js';
import {
  componentBuilder,
  extendPropsFrom,
  mergeClass
} from '@terraprisma/utils';

export interface IconProps extends ParentProps {
  /**
   * Outlined by default
   */
  variant?: 'outlined' | 'rounded' | 'sharp';

  style?: JSX.CSSProperties;
}

export type IconComponent = ReturnType<typeof createIconComponent>;

// not a decorator
const createIconComponent = (iconName: string) => {
  return componentBuilder<IconProps>()
    .factory(
      extendPropsFrom<IconProps, 'span'>(['variant', 'style', 'children'])
    )
    .create((props, elProps) => (
      <span
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
      </span>
    ));
};

export default createIconComponent;
