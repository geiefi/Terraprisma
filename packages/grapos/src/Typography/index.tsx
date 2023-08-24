import { ParentProps } from 'solid-js';

import { forwardComponentProps } from '../Helpers';

import Title from './Title';
import Paragraph from './Paragraph';

const Typography = forwardComponentProps<ParentProps, 'article'>(
  (props, elProps) => {
    return <article {...elProps}>{props.children}</article>;
  },
  ['children']
);

export { Typography, Paragraph, Title };
