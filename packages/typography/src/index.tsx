import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther } from '@grapos/utils';

import Title from './Title';
import Paragraph from './Paragraph';
import { Code, Colored, Decorated, Marked } from './highlighters';

const Typography = createComponentExtendingFromOther<ParentProps, 'article'>(
  (props, elProps) => {
    return <article {...elProps}>{props.children}</article>;
  },
  ['children']
);

export { Typography, Paragraph, Title, Marked, Decorated, Colored, Code };
