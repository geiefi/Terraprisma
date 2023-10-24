import {
  createEffect,
  createMemo,
  createSignal,
  JSX,
  Match,
  on,
  Switch
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { mergeRefs } from '@solid-primitives/refs';

import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';
import { Dropdown, IconButton, OutlinedButton } from '@terraprisma/general';
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

import DayPicker, { amountOfDaysInMonth } from './DayPicker';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';

export interface DatepickerProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, Date> = FieldName<OwnerFormValue, Date>
> extends FieldProps<OwnerFormValue, Date, Name> {
  label?: string;

  style?: JSX.CSSProperties;

  onChange?: (newValue: FormFieldValue) => any;
  onFocus?: () => any;
}

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

      let inputContainerRef!: HTMLDivElement;
      let dropdownRef: HTMLDivElement;

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
            onBlur={(event) => {
              if (
                !(event.relatedTarget instanceof HTMLElement) ||
                (event.relatedTarget !== dropdownRef &&
                  !dropdownRef.contains(event.relatedTarget))
              ) {
                // if the new focused element is not the dropdown, or not inside the dropdown
                !disabled() && setFocused(false);
              }
            }}
            icon={<CalendarMonth variant="rounded" />}
            actLikeHasContent
            ref={mergeRefs(elProps.ref, (ref) => (inputContainerRef = ref))}
          >
            {displayDate()}
          </InputContainer>

          <Portal>
            <GrowFade growingOrigin="top">
              <Dropdown
                for={inputContainerRef}
                ref={(ref) => (dropdownRef = ref)}
                tabindex="0"
                visible={focused()}
                class={mergeClass(
                  'h-[330px] !w-[330px] overflow-hidden cursor-default grid grid-cols-1 grid-rows-[2fr_8fr]'
                )}
              >
                <div class="px-4 relative flex flex-row items-center justify-between">
                  <IconButton size="small" onClick={handlePrevious}>
                    <ChevronLeft />
                  </IconButton>

                  <div class="w-fit flex gap-1.5">
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

                  <IconButton size="small" onClick={handleNext}>
                    <ChevronRight />
                  </IconButton>
                </div>

                <Row class="px-4 py-2.5 grid h-full overflow-x-hidden overflow-y-auto">
                  <Switch>
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
