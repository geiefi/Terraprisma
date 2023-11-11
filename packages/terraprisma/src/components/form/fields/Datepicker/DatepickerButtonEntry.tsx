import { Switch, Match, ParentProps, ComponentProps } from 'solid-js';

import DatepickerEntry from './DatepickerEntry';
import { mergeClass } from '../../../../utils';
import { IconButton, TextButton } from '../../../general';

interface DatepickerButtonEntryProps extends ParentProps {
  variant: 'squarish' | 'text';
  muted?: boolean;
  active: boolean;
  onClick: ComponentProps<'button'>['onClick'];
}

const DatepickerButtonEntry = (props: DatepickerButtonEntryProps) => {
  return (
    <DatepickerEntry muted={props.muted}>
      <Switch>
        <Match
          when={
            props.variant === 'squarish' || typeof props.variant === 'undefined'
          }
        >
          <IconButton
            class={mergeClass(props.muted && !props.active && 'text-inherit')}
            size="small"
            squarish
            rippleProps={{ center: true }}
            active={props.active}
            onClick={props.onClick}
          >
            {props.children}
          </IconButton>
        </Match>
        <Match when={props.variant === 'text'}>
          <TextButton
            class={mergeClass(props.muted && !props.active && 'text-inherit')}
            size="small"
            active={props.active}
            onClick={props.onClick}
          >
            {props.children}
          </TextButton>
        </Match>
      </Switch>
    </DatepickerEntry>
  );
};

export default DatepickerButtonEntry;
