import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  Match,
  on,
  splitProps,
  Switch
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { mergeRefs } from '@solid-primitives/refs';

import { FormFieldValue } from '../../types';

import DayPicker, { amountOfDaysInMonth } from './DayPicker';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';
import {
  Accents,
  createDismissListener,
  FieldRequiredProperties
} from '../../../..';
import { mergeClass } from '../../../../utils';
import { Popover, IconButton, OutlinedButton } from '../../../general';
import { CalendarMonth, ChevronLeft, ChevronRight } from '../../../icons';
import { Row } from '../../../layout';
import { GrowFade } from '../../../transitions';
import { InputLikeBase } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';
import { createValueSignal } from '../createValueSignal';

export type DatepickerProps = LeftIntersection<
  {
    label?: string;

    size?: 'small' | 'medium' | 'large';
    style?: JSX.CSSProperties;
    color?: Accents;

    onFocus?: () => any;
  } & FieldRequiredProperties,
  ComponentProps<'div'>
>;

const Datepicker = (allProps: DatepickerProps) => {
  const [props, elProps] = splitProps(allProps, [
    'label',
    'style',
    'size',
    'color',
    'value',
    'isInvalid',
    'disabled',
    'onInstantChange',
    'onFocus'
  ]);
  const color = () => props.color ?? 'accent';
  let inputContainerRef!: HTMLDivElement;
  let dropdownRef: HTMLDivElement;

  const [datepickerSelectionType, setDatepickerSelectionType] = createSignal<
    'day' | 'month' | 'year'
  >('day');

  const [focused, setFocused] = createSignal(false);

  const [value, setValue] = createValueSignal(props);

  createEffect(
    on(
      focused,
      () => {
        if (props.onFocus && focused() === true) {
          props.onFocus();
        }

        if (focused() === false) {
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

  const dismisser = createDismissListener({
    onDismiss: () => !props.disabled && setFocused(false),
    nonDismissingElements: () => [inputContainerRef]
  });
  return (
    <>
      <InputLikeBase
        {...elProps}
        color={color()}
        label={props.label}
        size={props.size}
        style={{
          cursor: props.disabled === false ? 'pointer' : 'default',
          ...props.style
        }}
        tabindex="0"
        onPointerDown={() => {
          !props.disabled && setFocused(true);
        }}
        onFocusIn={() => {
          !props.disabled && setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && focused()) {
            event.currentTarget.blur();
            setFocused(false);
          }
        }}
        icon={<CalendarMonth variant="rounded" />}
        hasErrors={props.isInvalid}
        hasContent={props.value !== undefined}
        focused={focused()}
        ref={mergeRefs(elProps.ref, (ref) => (inputContainerRef = ref))}
      >
        {displayDate()}
      </InputLikeBase>

      <Portal>
        <GrowFade growingOrigin="top">
          <Popover
            align="end"
            for={inputContainerRef}
            ref={mergeRefs(
              (ref: HTMLDivElement) => (dropdownRef = ref),
              dismisser.ref
            )}
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
          </Popover>
        </GrowFade>
      </Portal>
    </>
  );
};

export default Datepicker;
