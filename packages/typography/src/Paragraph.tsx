import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther, mergeClass } from '@terraprisma/utils';

import './Paragraph.scss';

export interface ParagraphProps extends ParentProps {}

const Paragraph = createComponentExtendingFromOther<ParagraphProps, 'p'>(
  (props, elProps) => {
    return (
      <p {...elProps} class={mergeClass('paragraph', elProps.class)}>
        {props.children}
      </p>
    );
  },
  ['children']
);

export default Paragraph;
