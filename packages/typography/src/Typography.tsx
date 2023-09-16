import { ParentProps } from 'solid-js';

import { createComponentExtendingFromOther } from '@terraprisma/utils';

const Typography = createComponentExtendingFromOther<ParentProps, 'article'>(
  (props, elProps) => {
    return <article {...elProps}>{props.children}</article>;
  },
  ['children']
);

export default Typography;
