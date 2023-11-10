import { ParentProps } from 'solid-js';

import {
  extendPropsFrom,
  componentBuilder,
  mergeClass
} from '~';

interface DatepickerEntryProps extends ParentProps {
  muted?: boolean;
}

const DatepickerEntry = componentBuilder<DatepickerEntryProps>()
  .factory(extendPropsFrom<DatepickerEntryProps, 'span'>(['children', 'muted']))
  .create((props, elProps) => {
    return (
      <span
        {...elProps}
        class={mergeClass(
          'w-full h-full border-box flex justify-center items-center text-center',
          props.muted && 'text-[var(--muted-fg)]',
          elProps.class
        )}
      >
        {props.children}
      </span>
    );
  });

export default DatepickerEntry;
