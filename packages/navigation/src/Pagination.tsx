import { For, Show, createMemo } from 'solid-js';

import {
  componentBuilder,
  extendPropsFrom,
  mergeClass
} from '@terraprisma/utils';
import { IconButton } from '@terraprisma/general';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@terraprisma/icons';
import { Accents, addAccentColoring } from '@terraprisma/core';

export interface PaginationProps {
  current: number;
  total: number;

  /**
   * @description The maximum amount of page numbers that are visible at once.
   * These pages are shown based on the starting pages, ending pages and pages surrounding the current one.
   *
   * Mostly this should be a odd number since this component tries to center the current page.
   *
   * @default 5
   */
  maximumAppearingChoices?: number;

  onChangePage?: (newPage: number, event?: MouseEvent) => any;
}

const PageNumber = (props: {
  pageNumber: number;
  active: boolean;
  onClick: (e: MouseEvent) => void;
  color: Accents;
}) => (
  <>
    <IconButton
      active={props.active}
      color={props.color}
      rippleProps={{ center: false }}
      squarish
      size="small"
      onClick={(e: MouseEvent) => props.onClick(e)}
    >
      {props.pageNumber}
    </IconButton>
  </>
);

const Etc = () => <div class="flex self-end pb-2 select-none"> ... </div>;

const Pagination = componentBuilder<PaginationProps>()
  .factory(addAccentColoring<PaginationProps>())
  .factory(
    extendPropsFrom<PaginationProps & { color?: Accents }, 'div'>([
      'current',
      'color',
      'maximumAppearingChoices',
      'total',
      'onChangePage'
    ])
  )
  .create((props, color, elProps) => {
    const maximumAppearingChoices = createMemo(
      () => props.maximumAppearingChoices || 5 - 2
    );

    const handleChangePage = (newPage: number, event: MouseEvent) => {
      if (typeof props.onChangePage === 'function') {
        props.onChangePage(newPage, event);
      }
    };

    const range = createMemo(() => {
      const pagesSurroundingCurrent: number[] = [];
      const half = Math.floor(maximumAppearingChoices() / 2);

      for (let offset = -half; offset <= half; offset++) {
        let pageNAtOffset = props.current + offset;

        if (pageNAtOffset <= 1) {
          pageNAtOffset = props.current + half + 2 - pageNAtOffset;
        } else if (pageNAtOffset >= props.total) {
          pageNAtOffset =
            props.current - half - 1 - (pageNAtOffset - props.total);
        }

        if (pageNAtOffset > props.total || pageNAtOffset < 1) {
          continue;
        }

        pagesSurroundingCurrent.push(pageNAtOffset);
      }
      return pagesSurroundingCurrent.sort((a, b) => a - b);
    });

    return (
      <div
        {...elProps}
        class={mergeClass('w-fit flex gap-3 flex-row my-1', elProps.class)}
      >
        <IconButton
          class="back"
          disabled={props.current === 1}
          squarish
          rippleProps={{ center: false }}
          size="small"
          onClick={(e: MouseEvent) => handleChangePage(props.current - 1, e)}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <Show when={!range().includes(1)}>
          <PageNumber
            pageNumber={1}
            active={props.current === 1}
            color={color()}
            onClick={(e) => handleChangePage(1, e)}
          />
        </Show>

        <Show when={!range().includes(2)}>
          <Etc />
        </Show>

        <For each={range()}>
          {(pageNumber) => (
            <PageNumber
              pageNumber={pageNumber}
              active={props.current === pageNumber}
              color={color()}
              onClick={(e) => handleChangePage(pageNumber, e)}
            />
          )}
        </For>

        <Show when={!range().includes(props.total - 1)}>
          <Etc />
        </Show>

        <Show when={!range().includes(props.total)}>
          <PageNumber
            pageNumber={props.total}
            active={props.current === props.total}
            color={color()}
            onClick={(e) => handleChangePage(props.total, e)}
          />
        </Show>

        <IconButton
          class="next"
          squarish
          disabled={props.current === props.total}
          rippleProps={{ center: false }}
          onClick={(e: MouseEvent) => handleChangePage(props.current + 1, e)}
          size="small"
        >
          <KeyboardArrowRight />
        </IconButton>
      </div>
    );
  });

export default Pagination;
