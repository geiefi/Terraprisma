import { JSX, ParentProps } from 'solid-js';
import { createComponentExtendingFromOther, mergeClass } from '../utils';

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
  return createComponentExtendingFromOther<IconProps, 'span'>(
    (props, elProps) => (
      <span
        {...elProps}
        class={mergeClass(
          `material-symbols-${props.variant || 'outlined'}`,
          elProps.class
        )}
        classList={elProps.classList}
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
    ),
    ['variant', 'style', 'children']
  );
};

export default createIconComponent;
