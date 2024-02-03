import { For, createMemo } from 'solid-js';
import DatepickerButtonEntry from './DatepickerButtonEntry';
import DatepickerEntry from './DatepickerEntry';

export const amountOfDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

interface DatepickerDay {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dateAtDay: Date;
  day: number;
}

export default function DayPicker(props: {
  month: number;
  year: number;

  selectedDate: Date;

  onDayClicked: (newDate: Date) => any;
}) {
  const amountOfDaysInCurrentMonth = createMemo(() =>
    amountOfDaysInMonth(props.year, props.month)
  );

  const daysOfCurrentMonth = createMemo(() => {
    const daysAmonut = amountOfDaysInCurrentMonth();

    const days: DatepickerDay[] = [];

    for (let index = 0; index < daysAmonut; index++) {
      const day = index + 1;
      const dateAtDay = new Date(props.year, props.month, day);
      days.push({
        day,
        dateAtDay,
        weekday: dateAtDay.getDay() as any
      });
    }

    return days;
  });

  const daysToShow = createMemo(() => {
    const days = [...daysOfCurrentMonth()];
    if (days.length > 0) {
      const month = props.month;
      const year = props.year;

      const firstDay = days[0];
      // loops through all days from monday to the first day
      // of the month
      for (let i = 0; i < firstDay.weekday; i++) {
        const date = new Date(year, month, -i);
        days.unshift({
          day: date.getDate(),
          weekday: date.getDay() as any,
          dateAtDay: date
        });
      }

      const lastDay = days[days.length - 1];
      const daysMissingTo42 = 42 - days.length;
      for (let i = 0; i < daysMissingTo42; i++) {
        const date = new Date(year, month, lastDay.day + i + 1);
        days.push({
          day: date.getDate(),
          weekday: date.getDay() as any,
          dateAtDay: date
        });
      }

      return days;
    } else {
      return [];
    }
  });

  const isOutsideOfView = (day: DatepickerDay) =>
    day.dateAtDay.getMonth() !== props.month;

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div class="tp-grid tp-grid-cols-7">
      <For each={weekDays}>
        {(day) => <DatepickerEntry muted>{day}</DatepickerEntry>}
      </For>

      <For each={daysToShow()}>
        {(day) => (
          <DatepickerButtonEntry
            muted={isOutsideOfView(day)}
            active={
              props.selectedDate &&
              props.selectedDate.getMonth() === day.dateAtDay.getMonth() &&
              props.selectedDate.getDate() === day.dateAtDay.getDate() &&
              props.selectedDate.getFullYear() === day.dateAtDay.getFullYear()
            }
            onClick={() => props.onDayClicked(day.dateAtDay)}
            variant="squarish"
          >
            {day.day}
          </DatepickerButtonEntry>
        )}
      </For>
    </div>
  );
}
