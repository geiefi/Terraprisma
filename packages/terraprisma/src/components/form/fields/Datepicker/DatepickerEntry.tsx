import { ComponentProps, splitProps } from 'solid-js';
import {
  mergeClass
} from '../../../../utils';
import { LeftIntersection } from '../../../../types/LeftIntersection';

export type DatepickerEntryProps = LeftIntersection<
  {
    muted?: boolean;
  },
  ComponentProps<'span'>
>;

const DatepickerEntry = (allProps: DatepickerEntryProps) => {
  const [props, elProps] = splitProps(allProps, ['muted']);
  return (
    <span
      {...elProps}
      class={mergeClass(
        'tp-w-full tp-h-full tp-border-box tp-flex tp-justify-center tp-items-center tp-text-center',
        props.muted && 'tp-text-[var(--muted-fg)]',
        elProps.class
      )}
    >
      {elProps.children}
    </span>
  );
};

export default DatepickerEntry;
