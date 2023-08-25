import { ParentProps } from 'solid-js';

import {
  mergeClass,
  createComponentExtendingFromOther
} from '../../../../../utils';

import './Label.scss';

export interface LabelProps extends ParentProps {
  for: string;
  hasErrors: boolean;
}

const Label = createComponentExtendingFromOther<LabelProps, 'label'>(
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
