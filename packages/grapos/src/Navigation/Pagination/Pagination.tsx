import { For, Show, createMemo } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers';

import { Button } from '../../General';
import { ArrowBackIosNew, ArrowForwardIos } from '../../Icons';

import { mergeClass } from '../../_Shared/Utils';

import './Pagination.scss';

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

const Pagination = forwardNativeElementProps<PaginationProps, HTMLDivElement>(
  (props, elProps) => {
    const maximumAppearingChoices = createMemo(() => props.maximumAppearingChoices || 5 - 2);

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
          pageNAtOffset = props.current - half - 1 - (pageNAtOffset - props.total);
        }

        if (pageNAtOffset > props.total || pageNAtOffset < 1) {
          continue;
        }

        pagesSurroundingCurrent.push(pageNAtOffset);
      }
        return pagesSurroundingCurrent.sort((a,b) => a - b);
    });

    const PageNumber = (p: { pageN: number }) => (
      <Button.Icon
        color={p.pageN === props.current ? 'primary' : undefined}
        class="page-number"
        size="small"
        onClick={(e: MouseEvent) => handleChangePage(p.pageN, e)}
      >
        {p.pageN}
      </Button.Icon>
    );

    const Etc = () => 
      <div class="etc-icon"> ... </div>;

    return <div {...elProps} class={mergeClass('pagination-container', elProps.class)}>
      <Button.Icon 
        class="back" 
        disabled={props.current === 1}
        size="small"
        onClick={(e: MouseEvent) => handleChangePage(props.current - 1, e)}
      > <ArrowBackIosNew /> </Button.Icon>

      <Show when={!range().includes(1)}> <PageNumber pageN={1}/> </Show>

      <Show when={!range().includes(2)}> <Etc/> </Show>

      <For each={range()}>{
        (pageN) => <PageNumber pageN={pageN}/>
      }</For>

      <Show when={!range().includes(props.total - 1)}> <Etc/> </Show>

      <Show when={!range().includes(props.total)}> <PageNumber pageN={props.total}/> </Show>

      <Button.Icon 
        class="next" 
        disabled={props.current === props.total}
        onClick={(e: MouseEvent) => handleChangePage(props.current + 1, e)}
        size="small"
      > <ArrowForwardIos /> </Button.Icon>
    </div>;
  },
  ['current', 'total', 'onChangePage']
)

export default Pagination;
