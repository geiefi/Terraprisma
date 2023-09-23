import { JSX, ParentProps, Show, createMemo } from 'solid-js';

import { useField } from '../../fields';

import { addAccentColoring, Accents } from '@terraprisma/theming';
import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import Label from '../Label/Label';

import './InputContainer.scss';

export interface InputContainerProps extends ParentProps {
  labelFor: string;
  label?: JSX.Element;

  icon?: JSX.Element;
}

const InputContainer = makeComponent(
  [
    addAccentColoring<InputContainerProps>(),
    extendPropsFrom<InputContainerProps & { color?: Accents }, 'div'>([
      'children',
      'labelFor',
      'label',
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
          '--bg': `var(--${color()}-bg)`
        }}
        classList={{
          focused: focused(),
          'has-content': hasContent(),
          disabled: disabled(),
          error: hasErrors(),

          ...elProps.classList
        }}
      >
        <Show when={props.label}>
          <Label for={props.labelFor} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        {props.children}

        <span class="input-container-icon">{props.icon}</span>
      </div>
    );
  }
);

export default InputContainer;
