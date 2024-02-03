import { Index, createMemo } from 'solid-js';
import DatepickerButtonEntry from './DatepickerButtonEntry';

export default function YearPicker(props: {
  month: number;
  year: number;

  selectedDate: Date;

  onYearClicked: (month: number) => any;
}) {
  const years = createMemo(() => {
    const result = [];
    const start = props.year - 7;
    const end = props.year + 8;
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  });

  return (
    <div class="tp-grid tp-grid-cols-5">
      <Index each={years()}>
        {(year) => (
          <DatepickerButtonEntry
            variant="text"
            active={
              props.selectedDate
                ? props.month === props.selectedDate.getMonth() &&
                  year() === props.selectedDate.getFullYear()
                : false
            }
            onClick={() => props.onYearClicked(year())}
          >
            {year()}
          </DatepickerButtonEntry>
        )}
      </Index>
    </div>
  );
}
