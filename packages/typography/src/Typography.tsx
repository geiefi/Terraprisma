import { ParentProps } from 'solid-js';

import { extendPropsFrom, makeComponent } from '@terraprisma/utils';

const Typography = makeComponent(
  [extendPropsFrom<ParentProps, 'article'>(['children'])],
  (props, elProps) => {
    return <article {...elProps}>{props.children}</article>;
  }
);

export default Typography;
