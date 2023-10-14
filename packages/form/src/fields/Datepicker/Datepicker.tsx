import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  JSX,
  Match,
  on,
  onCleanup,
  onMount,
  Switch
} from 'solid-js';
import { Portal } from 'solid-js/web';

import {
  canUseDocument,
  extendPropsFrom,
  makeComponent
} from '@terraprisma/utils';
import {
  Dropdown,
  IconButton,
  OutlinedButton,
  TextButton
} from '@terraprisma/general';
import { CalendarMonth, ChevronLeft, ChevronRight } from '@terraprisma/icons';
import { Row } from '@terraprisma/layout';
import { GrowFade } from '@terraprisma/transitions';
import { Accents, addAccentColoring } from '@terraprisma/core';

import {
  setupFieldComponent,
  FieldInternalWrapper,
  FieldName,
  FieldProps,
  FieldPropKeys,
  useField,
  InputContainer
} from '../utils';

import { FormFieldValue, FormValue } from '../../types';

import './Datepicker.scss';

export interface DatepickerProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, Date> = FieldName<OwnerFormValue, Date>
> extends FieldProps<OwnerFormValue, Date, Name> {
  label?: string;

  style?: JSX.CSSProperties;

  onChange?: (newValue: FormFieldValue) => any;
  onFocus?: () => any;
}

interface DatepickerDay {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dateAtDay: Date;
  day: number;
}

const amountOfDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const DayPicker: Component<{
  month: number;
  year: number;

  selectedDate: Date;

  onDayClicked: (newDate: Date) => any;
}> = (props) => {
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

  return (
    <div class="days-listing">
      <span class="entry header">S</span>
      <span class="entry header">M</span>
      <span class="entry header">T</span>
      <span class="entry header">W</span>
      <span class="entry header">T</span>
      <span class="entry header">F</span>
      <span class="entry header">S</span>

      <For each={daysToShow()}>
        {(day) => (
          <span
            class="entry"
            classList={{
              'outside-of-view': day.dateAtDay.getMonth() !== props.month
            }}
          >
            <IconButton
              size="small"
              squarish
              rippleProps={{ center: true }}
              active={
                props.selectedDate.getMonth() === day.dateAtDay.getMonth() &&
                props.selectedDate.getDate() === day.dateAtDay.getDate() &&
                props.selectedDate.getFullYear() === day.dateAtDay.getFullYear()
              }
              onClick={() => props.onDayClicked(day.dateAtDay)}
            >
              {day.day}
            </IconButton>
          </span>
        )}
      </For>
    </div>
  );
};

const MonthPicker: Component<{
  month: number;
  year: number;

  monthNames: string[];
  selectedDate: Date;

  onMonthClicked: (month: number) => any;
}> = (props) => {
  return (
    <div class="months-listing">
      <Index each={props.monthNames}>
        {(month, monthNumber) => (
          <span class="entry">
            <TextButton
              size="small"
              active={
                monthNumber === props.selectedDate.getMonth() &&
                props.year === props.selectedDate.getFullYear()
              }
              onClick={() => props.onMonthClicked(monthNumber)}
            >
              {month()}
            </TextButton>
          </span>
        )}
      </Index>
    </div>
  );
};

const YearPicker: Component<{
  month: number;
  year: number;

  selectedDate: Date;

  onYearClicked: (month: number) => any;
}> = (props) => {
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
    <div class="years-listing">
      <Index each={years()}>
        {(year) => (
          <span class="entry">
            <TextButton
              size="small"
              active={
                props.month === props.selectedDate.getMonth() &&
                year() === props.selectedDate.getFullYear()
              }
              onClick={() => props.onYearClicked(year())}
            >
              {year()}
            </TextButton>
          </span>
        )}
      </Index>
    </div>
  );
};

const Datepicker = setupFieldComponent<Date>().with(
  makeComponent(
    [
      addAccentColoring<DatepickerProps>(),
      extendPropsFrom<DatepickerProps & { color?: Accents }, 'div'>([
        ...FieldPropKeys,
        'label',
        'helperText',
        'style',
        'color',
        'onChange',
        'onFocus'
      ])
    ],
    (props, color, elProps) => {
      const {
        elementId: id,
        disabledS: [disabled],
        focusedS: [focused, setFocused],
        valueS: [value, setValue],
        validate
      } = useField<Date>()!;

      const [inputContainerRef, setInputContainerRef] =
        createSignal<HTMLDivElement>();
      const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();

      const onDocumentClick = (event: MouseEvent) => {
        if (
          event.target !== inputContainerRef() &&
          event.target !== dropdownRef() &&
          !dropdownRef()?.contains(event.target as HTMLElement) &&
          focused()
        ) {
          setFocused(false);
        }
      };

      onMount(() => {
        if (canUseDocument())
          document.addEventListener('click', onDocumentClick);
      });

      onCleanup(() => {
        if (canUseDocument())
          document.removeEventListener('click', onDocumentClick);
      });

      const [datepickerSelectionType, setDatepickerSelectionType] =
        createSignal<'day' | 'month' | 'year'>('day');

      createEffect(
        on(
          focused,
          () => {
            if (props.onFocus && focused() === true) {
              props.onFocus();
            }

            if (focused() === false) {
              validate(value());
              setDatepickerSelectionType('day');
            }
          },
          { defer: true }
        )
      );

      const [viewedMonth, setViewedMonth] = createSignal<number>(
        value() ? value()!.getMonth() : new Date().getMonth()
      );

      const [viewedYear, setViewedYear] = createSignal<number>(
        value() ? value()!.getFullYear() : new Date().getFullYear()
      );

      createEffect(() => {
        const currentDate = value() || new Date();

        setViewedMonth(currentDate.getMonth());
        setViewedYear(currentDate.getFullYear());
      });

      const handleNext = () => {
        switch (datepickerSelectionType()) {
          case 'day':
            if (viewedMonth() === 11) {
              setViewedYear((year) => year + 1);
              setViewedMonth(0);
            } else {
              setViewedMonth((month) => month + 1);
            }
            break;
          case 'month':
            setViewedYear((year) => year + 1);
            break;
          case 'year':
            setViewedYear((year) => year + 15);
            break;
        }
      };

      const handlePrevious = () => {
        switch (datepickerSelectionType()) {
          case 'day':
            if (viewedMonth() === 0) {
              setViewedYear((year) => year - 1);
              setViewedMonth(11);
            } else {
              setViewedMonth((month) => month - 1);
            }
            break;
          case 'month':
            setViewedYear((year) => year - 1);
            break;
          case 'year':
            setViewedYear((year) => year - 15);
            break;
        }
      };

      createEffect(on(value, () => setFocused(false), { defer: true }));

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      const displayDate = createMemo(() => {
        const selectedDate = value();

        if (selectedDate) {
          const DD = ('00' + selectedDate.getDate()).slice(-2);
          const MM = ('00' + (selectedDate.getMonth() + 1)).slice(-2);
          const YYYY = ('0000' + selectedDate.getFullYear()).slice(-4);
          return `${DD}/${MM}/${YYYY}`;
        } else {
          return 'DD/MM/YYYY';
        }
      });

      return (
        <FieldInternalWrapper>
          <InputContainer
            {...elProps}
            id={id()}
            labelFor={id()}
            color={color()}
            label={props.label}
            style={{
              cursor: disabled() === false ? 'pointer' : 'default',
              ...props.style
            }}
            tabindex="0"
            onFocus={() => !disabled() && setFocused(true)}
            onBlur={() => !disabled() && setFocused(false)}
            icon={<CalendarMonth variant="rounded" />}
            ref={(ref) => {
              if (typeof elProps.ref === 'function') {
                elProps.ref(ref);
              }

              setInputContainerRef(ref);
            }}
          >
            {displayDate()}
          </InputContainer>

          <Portal>
            <GrowFade growingOrigin="top">
              <Dropdown
                for={inputContainerRef()!}
                visible={focused()}
                class="datepicker-dropdown"
                ref={setDropdownRef}
              >
                <div class="dropdown-header">
                  <IconButton
                    size="small"
                    class="arrow-previous"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <div class="selection-type-button-chooser">
                    <OutlinedButton
                      size="small"
                      active={datepickerSelectionType() === 'month'}
                      onClick={() => {
                        if (datepickerSelectionType() === 'month') {
                          setDatepickerSelectionType('day');
                        } else {
                          setDatepickerSelectionType('month');
                        }
                      }}
                    >
                      {monthNames[viewedMonth()]}
                    </OutlinedButton>

                    <OutlinedButton
                      size="small"
                      active={datepickerSelectionType() === 'year'}
                      onClick={() => {
                        if (datepickerSelectionType() === 'year') {
                          setDatepickerSelectionType('day');
                        } else {
                          setDatepickerSelectionType('year');
                        }
                      }}
                    >
                      {viewedYear()}
                    </OutlinedButton>
                  </div>

                  <IconButton
                    size="small"
                    class="arrow-next"
                    onClick={handleNext}
                  >
                    <ChevronRight />
                  </IconButton>
                </div>

                <Row class="dropdown-content">
                  <Switch>
                    <Match when={typeof value() === 'undefined'}>...</Match>
                    <Match when={datepickerSelectionType() === 'day'}>
                      <DayPicker
                        year={viewedYear()}
                        month={viewedMonth()}
                        onDayClicked={(newDate) => setValue(newDate)}
                        selectedDate={value()!}
                      />
                    </Match>
                    <Match when={datepickerSelectionType() === 'month'}>
                      <MonthPicker
                        year={viewedYear()}
                        month={viewedMonth()}
                        monthNames={monthNames}
                        onMonthClicked={(month) => {
                          setValue(
                            new Date(
                              viewedYear(),
                              month,
                              Math.min(
                                amountOfDaysInMonth(viewedYear(), month),
                                value()?.getDate() || 1
                              )
                            )
                          );
                        }}
                        selectedDate={value()!}
                      />
                    </Match>
                    <Match when={datepickerSelectionType() === 'year'}>
                      <YearPicker
                        year={viewedYear()}
                        month={viewedMonth()}
                        onYearClicked={(year) => {
                          setValue(
                            new Date(
                              year,
                              viewedMonth(),
                              Math.min(
                                amountOfDaysInMonth(year, viewedMonth()),
                                value()?.getDate() || 1
                              )
                            )
                          );
                        }}
                        selectedDate={value()!}
                      />
                    </Match>
                  </Switch>
                </Row>
              </Dropdown>
            </GrowFade>
          </Portal>
        </FieldInternalWrapper>
      );
    }
  ),
  new Date()
);

export default Datepicker;
