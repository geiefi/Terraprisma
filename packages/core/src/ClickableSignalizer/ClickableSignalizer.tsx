import { ComponentProps, ParentProps, Show } from 'solid-js';

import { Fade } from '@grapos/transitions';

import { createComponentExtendingFromOther, mergeClass } from '@grapos/utils';

import './ClickableSignalizer.scss';

export interface ClickableSignalizerProps extends ParentProps {
  clickableSignalizerProps?: ComponentProps<'span'>;
  color?: string;
  show?: boolean;
}

const ClickableSignalizer = createComponentExtendingFromOther<
  ClickableSignalizerProps,
  'div'
>(
  (props, elProps) => (
    <div
      {...elProps}
      class={mergeClass('clickable-signalizer-container', elProps.class)}
    >
      {props.children}

      <Fade>
        <Show when={props.show}>
          <span
            {...props.clickableSignalizerProps}
            class={mergeClass(
              'clickable-signalizer',
              props.clickableSignalizerProps?.class
            )}
            style={{
              '--color': props.color || 'rgba(0,0,0,0.04)'
            }}
          />
        </Show>
      </Fade>
    </div>
  ),
  ['children', 'show', 'color', 'clickableSignalizerProps']
);

export default ClickableSignalizer;
