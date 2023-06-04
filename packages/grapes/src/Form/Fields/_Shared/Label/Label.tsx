import { Component, JSX, splitProps } from 'solid-js';
import { mergeClass } from '../../../../_Shared/Utils';

import './Label.scss';

export interface LabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {
  for: string;
  hasErrors: boolean;
  children: JSX.Element | undefined;
}

const Label: Component<LabelProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps,
    ['for', 'hasErrors']
  );

  return <label
    for={props.for}
    {...elProps}
    class={mergeClass("label", elProps.class)}
    classList={{
      error: props.hasErrors,
      ...elProps.classList
    }}
  >
    {elProps.children}
  </label>;
};

export default Label;
