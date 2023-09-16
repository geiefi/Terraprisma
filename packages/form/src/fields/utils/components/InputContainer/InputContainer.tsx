import { JSX, Show, createMemo } from 'solid-js';

import { useField } from '../../fields';

import { PossibleColors } from '@terraprisma/core';
import { createComponentExtendingFromOther, mergeClass } from '@terraprisma/utils';

import Label from '../Label/Label';

import './InputContainer.scss';

export interface InputContainerProps {
  labelFor: string;
  label?: JSX.Element;

  color?: PossibleColors;
  icon?: JSX.Element;
}

const InputContainer = createComponentExtendingFromOther<
  InputContainerProps,
  'div'
>(
  (props, elProps) => {
    const {
      focusedS: [focused],
      disabledS: [disabled],
      hasErrors,
      hasContent
    } = useField()!;

    const color = createMemo(() => props.color || 'accent');

    return (
      <div
        {...elProps}
        class={mergeClass('input-container', elProps.class)}
        style={{
          '--choosen-accent-bg': `var(--${color()}-bg)`
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

        {elProps.children}

        <span class="input-container-icon">{props.icon}</span>
      </div>
    );
  },
  ['labelFor', 'label', 'color', 'icon']
);

export default InputContainer;
