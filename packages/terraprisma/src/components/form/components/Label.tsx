import { ComponentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type LabelProps = LeftIntersection<
  {
    for: string;
    hasErrors: boolean;
  },
  ComponentProps<'label'>
>;

const Label = (allProps: LabelProps) => {
  const [props, elProps] = splitProps(allProps, ['for', 'hasErrors']);
  return (
    <label
      for={props.for}
      {...elProps}
      class={mergeClass(
        'tp-select-none tp-pointer-events-none',
        props.hasErrors && 'tp-text-[var(--danger-bg)]',
        elProps.class
      )}
    >
      {elProps.children}
    </label>
  );
};

export default Label;
