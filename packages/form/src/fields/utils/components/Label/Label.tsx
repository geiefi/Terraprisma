import { ParentProps } from 'solid-js';

import { mergeClass, makeComponent, extendPropsFrom } from '@terraprisma/utils';

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
      class={mergeClass(
        'select-none pointer-events-none',
        props.hasErrors && 'text-[var(--danger-bg)]',
        elProps.class
      )}
    >
      {props.children}
    </label>
  )
);

export default Label;
