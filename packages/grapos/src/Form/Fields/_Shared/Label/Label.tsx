import { ParentProps } from 'solid-js';
import { mergeClass } from '../../../../_Shared/Utils';

import './Label.scss';
import { forwardComponentProps } from '../../../../Helpers';

export interface LabelProps extends ParentProps {
  for: string;
  hasErrors: boolean;
}

const Label = forwardComponentProps<LabelProps, 'label'>(
  (props, elProps) => (
    <label
      for={props.for}
      {...elProps}
      class={mergeClass('label', elProps.class)}
      classList={{
        error: props.hasErrors,
        ...elProps.classList
      }}
    >
      {props.children}
    </label>
  ),
  ['for', 'hasErrors', 'children']
);

export default Label;
