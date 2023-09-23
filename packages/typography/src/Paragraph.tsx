import { ParentProps } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import './Paragraph.scss';

export interface ParagraphProps extends ParentProps {}

const Paragraph = makeComponent(
  [extendPropsFrom<ParagraphProps, 'p'>(['children'])],
  (props, elProps) => {
    return (
      <p {...elProps} class={mergeClass('paragraph', elProps.class)}>
        {props.children}
      </p>
    );
  }
);

export default Paragraph;
