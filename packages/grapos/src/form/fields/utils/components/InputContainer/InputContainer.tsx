import { JSX, Show } from 'solid-js';

import { useField } from '../../fields';
import { useDepth } from '../../../../../general/Box/Box';

import {
  createComponentExtendingFromOther,
  mergeClass
} from '../../../../../utils';

import Label from '../Label/Label';

import './InputContainer.scss';

export interface InputContainerProps {
  labelFor: string;
  label?: JSX.Element;

  color?: 'primary' | 'secondary' | 'tertiary';
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

    const depth = useDepth() || (() => 0);

    return (
      <div
        {...elProps}
        class={mergeClass('input-container', elProps.class)}
        classList={{
          primary:
            props.color === 'primary' || typeof props.color === 'undefined',
          secondary: props.color === 'secondary',
          tertiary: props.color === 'tertiary',

          focused: focused(),
          'has-content': hasContent(),
          disabled: disabled(),
          error: hasErrors(),

          'gray-2': depth() === 1 || depth() === 3,
          'gray-3': depth() === 2,

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
