import { Component, ComponentProps, ParentProps, Show, createEffect } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers/forwardElementProps';
import { mergeClass } from '../../_Shared/Utils';
import { Fade, GrowFade } from '../../Transitions';

import './ClickableSignalizer.scss';

export interface ClickableSignalizerProps extends ParentProps {
  clickableSignalizerProps?: ComponentProps<'span'>;
  color?: string,
  show?: boolean,
}

const ClickableSignalizer: Component<ClickableSignalizerProps> = forwardNativeElementProps<
  ClickableSignalizerProps, HTMLDivElement
>(
  (props, elProps) => {
    createEffect(() => {
      console.log(props.show);
    });

    return <div
      {...elProps}
      class={mergeClass('clickable-signalizer-container', elProps.class)}
    >
      {props.children}

      <GrowFade growingOrigin="center">
        <Show when={props.show}>
          <span 
            {...props.clickableSignalizerProps} 
            class={mergeClass('clickable-signalizer', props.clickableSignalizerProps?.class)} 
            style={{
              '--color': props.color || 'var(--gray-5)'
            }}
          />
        </Show>
      </GrowFade>
    </div>;
  },
  ['children', 'show', 'color', 'clickableSignalizerProps']
);

export default ClickableSignalizer;
