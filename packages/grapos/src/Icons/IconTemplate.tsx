import { Component, JSX, splitProps } from 'solid-js';
import { mergeClass } from '../_Shared/Utils';

export interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /**
   * Outlined by default
   */
  variant?: 'outlined' | 'rounded' | 'sharp',

  style?: JSX.CSSProperties,
}

export type IconComponent = Component<IconProps>;

// not a decorator
export function createIconComponent(iconName: string): IconComponent {
  return (allProps) => {
    const [props, elProps] = splitProps(allProps, ['variant']);

    return <span 
      {...elProps}
      class={mergeClass(`material-symbols-${props.variant || 'outlined'}`, elProps.class)}
      classList={elProps.classList}
      style={{
        'font-size': 'inherit',
        'scale': '1.4',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        ...elProps.style
      }}
    >
      {iconName}
    </span>;
  };
}
