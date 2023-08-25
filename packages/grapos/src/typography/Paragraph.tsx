import { ParentProps } from 'solid-js';

import { forwardComponentProps } from '../Helpers';

import './Paragraph.scss';
import { mergeClass } from '../_Shared/Utils';

export interface ParagraphProps extends ParentProps {}

const Paragraph = forwardComponentProps<ParagraphProps, 'p'>(
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
