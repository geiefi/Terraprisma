import { ParentProps } from 'solid-js';

import {
  mergeClass,
  componentBuilder,
  extendPropsFrom
} from '~';

export interface LabelProps extends ParentProps {
  for: string;
  hasErrors: boolean;
}

const Label = componentBuilder<LabelProps>()
  .factory(
    extendPropsFrom<LabelProps, 'label'>(['for', 'hasErrors', 'children'])
  )
  .create((props, elProps) => (
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
  ));

export default Label;
