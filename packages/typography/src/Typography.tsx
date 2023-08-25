import { ParentProps } from "solid-js";

import { createComponentExtendingFromOther } from "@grapos/utils";

const Typography = createComponentExtendingFromOther<ParentProps, 'article'>(
  (props, elProps) => {
    return <article {...elProps}>{props.children}</article>;
  },
  ['children']
);

export default Typography;
