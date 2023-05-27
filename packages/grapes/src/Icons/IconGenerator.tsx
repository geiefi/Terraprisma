import type { Component, JSX } from 'solid-js';
import { mergeClass } from '../_Shared/Utils';

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
      class={mergeClass(`material-symbols-${props.variant || 'outlined'}`, props.class)}
      style={{
        'font-size': 'inherit',
        'scale': '1.4',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        ...props.style
      }}
      classList={props.classList}
    >
      {iconName}
    </span>;
  };
}
