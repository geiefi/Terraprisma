import type { Component, JSX } from 'solid-js';

export type IconProps = {
  /**
   * Outlined by default
   */
  variant?: 'outlined' | 'rounded' | 'sharp',

  class?: string,
  classList?: Record<string, boolean | undefined>,
  style?: JSX.CSSProperties,
};

export type IconComponent = Component<IconProps>;

// not a decorator
export function createIconComponent(iconName: string): IconComponent {
  return (props) => {
    return <span 
      class={`material-symbols-${props.variant || 'outlined'} ${props.class || ''}`}
      style={{
        'font-size': 'inherit',
        'scale': '1.4',
        ...props.style
      }}
      classList={props.classList}
    >
      {iconName}
    </span>;
  };
}
