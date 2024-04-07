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
        'w-full h-full border-box flex justify-center items-center text-center',
        props.muted && 'text-[var(--muted-fg)]',
        elProps.class
      )}
    >
      {elProps.children}
    </span>
  );
};

export default DatepickerEntry;
