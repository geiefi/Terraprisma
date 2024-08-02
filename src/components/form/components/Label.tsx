import { ComponentProps, splitProps } from 'solid-js';
import { mergeClass } from '../../../utils';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type LabelProps = LeftIntersection<
  {
    hasErrors?: boolean;
  },
  ComponentProps<'label'>
>;

const Label = (allProps: LabelProps) => {
  const [props, elProps] = splitProps(allProps, ['hasErrors']);
  return (
    <label
      {...elProps}
      class={mergeClass(
        'select-none pointer-events-none',
        props.hasErrors && 'text-[var(--danger-bg)]',
        elProps.class
      )}
    >
      {elProps.children}
    </label>
  );
};

export default Label;
