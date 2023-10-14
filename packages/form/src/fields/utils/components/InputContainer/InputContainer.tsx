import { JSX, ParentProps, Show } from 'solid-js';

import { useField } from '../../fields';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import Label from '../Label/Label';

import './InputContainer.scss';
import { Accents, addAccentColoring } from '@terraprisma/theming';

export interface InputContainerProps extends ParentProps {
  labelFor: string;
  label?: JSX.Element;

  icon?: JSX.Element;
  style?: JSX.CSSProperties;
}

const InputContainer = makeComponent(
  [
    addAccentColoring<InputContainerProps>(),
    extendPropsFrom<InputContainerProps & { color?: Accents }, 'div'>([
      'children',
      'labelFor',
      'label',
      'style',
      'icon'
    ])
  ],
  (props, color, elProps) => {
    const {
      focusedS: [focused],
      disabledS: [disabled],
      hasErrors,
      hasContent
    } = useField()!;

    return (
      <div
        {...elProps}
        class={mergeClass('input-container', elProps.class)}
        style={{
          '--color': `var(--${color()}-bg)`,
          ...props.style
        }}
        classList={{
          focused: focused(),
          'has-content': hasContent(),
          disabled: disabled(),
          error: hasErrors(),
          'has-label': typeof props.label !== 'undefined',

          ...elProps.classList
        }}
      >
        <Show when={props.label}>
          <Label for={props.labelFor} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        {props.children}

        <Show when={props.icon}>
          <span class="input-container-icon">{props.icon}</span>
        </Show>
      </div>
    );
  }
);

export default InputContainer;
