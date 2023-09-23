import { For, Show, createMemo } from 'solid-js';

import { makeComponent, extendPropsFrom, mergeClass } from '@terraprisma/utils';

import { Button, IconButton } from '@terraprisma/core';
import { ArrowBackIosNew, ArrowForwardIos } from '@terraprisma/icons';

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

const Pagination = makeComponent(
  [
    extendPropsFrom<PaginationProps, 'div'>([
      'current',
      'total',
      'onChangePage'
    ])
  ],
  (props, elProps) => {
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

    const PageNumber = (p: { pageN: number }) => (
      <>
        TODO: find the best way to have the icon button here
        {/* <IconButton */}
        {/*   class={mergeClass( */}
        {/*     p.pageN === props.current && '!bg-[var(--bg)] !text-[var(--fg)]' */}
        {/*   )} */}
        {/*   size="small" */}
        {/*   centerRipple */}
        {/*   onClick={(e: MouseEvent) => handleChangePage(p.pageN, e)} */}
        {/* > */}
        {/*   {p.pageN} */}
        {/* </IconButton> */}
      </>
    );

    const Etc = () => <div class="flex self-end pb-2 select-none"> ... </div>;

    return (
      <div
        {...elProps}
        class={mergeClass('w-full flex gap-3 flex-row my-1', elProps.class)}
      >
        {/* <Button.Icon */}
        {/*   class="back" */}
        {/*   disabled={props.current === 1} */}
        {/*   size="small" */}
        {/*   onClick={(e: MouseEvent) => handleChangePage(props.current - 1, e)} */}
        {/* > */}
        {/*   <ArrowBackIosNew /> */}
        {/* </Button.Icon> */}

        <Show when={!range().includes(1)}>
          <PageNumber pageN={1} />
        </Show>

        <Show when={!range().includes(2)}>
          <Etc />
        </Show>

        <For each={range()}>{(pageN) => <PageNumber pageN={pageN} />}</For>

        <Show when={!range().includes(props.total - 1)}>
          <Etc />
        </Show>

        <Show when={!range().includes(props.total)}>
          <PageNumber pageN={props.total} />
        </Show>

        {/* <Button.Icon */}
        {/*   class="next" */}
        {/*   disabled={props.current === props.total} */}
        {/*   onClick={(e: MouseEvent) => handleChangePage(props.current + 1, e)} */}
        {/*   size="small" */}
        {/* > */}
        {/*   <ArrowForwardIos /> */}
        {/* </Button.Icon> */}
      </div>
    );
  }
);

export default Pagination;
