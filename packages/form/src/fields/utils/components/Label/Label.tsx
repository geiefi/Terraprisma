import { ParentProps } from 'solid-js';

import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

import './Label.scss';

export interface LabelProps extends ParentProps {
  for: string;
  hasErrors: boolean;
}

const Label = makeComponent(
  [extendPropsFrom<LabelProps, 'label'>(['for', 'hasErrors', 'children'])],
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
  )
);

export default Label;
