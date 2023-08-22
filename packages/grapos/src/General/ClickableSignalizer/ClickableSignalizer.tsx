import { ComponentProps, ParentProps, Show } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers';
import { mergeClass } from '../../_Shared/Utils';
import { Fade } from '../../Transitions';

import './ClickableSignalizer.scss';

export interface ClickableSignalizerProps extends ParentProps {
  clickableSignalizerProps?: ComponentProps<'span'>;
  color?: string;
  show?: boolean;
}

const ClickableSignalizer = forwardNativeElementProps<
  ClickableSignalizerProps,
  HTMLDivElement
>(
  (props, elProps) => {
    return (
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
                props.clickableSignalizerProps?.class,
              )}
              style={{
                '--color': props.color || 'var(--gray-5)',
              }}
            />
          </Show>
        </Fade>
      </div>
    );
  },
  ['children', 'show', 'color', 'clickableSignalizerProps'],
);

export default ClickableSignalizer;
