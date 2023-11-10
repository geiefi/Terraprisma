import { Index } from 'solid-js';
import DatepickerButtonEntry from './DatepickerButtonEntry';

export default function MonthPicker(props: {
  month: number;
  year: number;

  monthNames: string[];
  selectedDate: Date;

  onMonthClicked: (month: number) => any;
}) {
  return (
    <div class="grid grid-cols-3">
      <Index each={props.monthNames}>
        {(month, monthNumber) => (
          <DatepickerButtonEntry
            variant="text"
            active={
              props.selectedDate
                ? monthNumber === props.selectedDate.getMonth() &&
                  props.year === props.selectedDate.getFullYear()
                : false
            }
            onClick={() => props.onMonthClicked(monthNumber)}
          >
            {month()}
          </DatepickerButtonEntry>
        )}
      </Index>
    </div>
  );
}
