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
    extendPropsFrom<InputContainerProps, 'div'>([
      'children',
      'labelFor',
      'label',
      'icon'
    ])
  ],
  (props, elProps) => {
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
