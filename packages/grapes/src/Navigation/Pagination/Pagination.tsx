import { For, Match, Show, Switch, createMemo } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers';

import { Button } from '../../General';
import { ArrowBack, ArrowBackIos, ArrowBackIosNew, ArrowForward, ArrowForwardIos, MoreHoriz } from '../../Icons';

import { mergeClass } from '../../_Shared/Utils';

import './Pagination.scss';

export interface PaginationProps {
  current: number;
  total: number;

  /**
   * @description The maximum amount of page numbers that are visible at once.
   * These pages are shown based on the starting pages, ending pages and pages surrounding the current one.
   *
   * @default 6 
   */
  maximumAppearingChoices?: number;

  onChangePage?: (newPage: number, event?: MouseEvent) => any;
}

const Pagination = forwardNativeElementProps<PaginationProps, HTMLDivElement>(
  (props, elProps) => {
    const maximumAppearingChoices = createMemo(() => props.maximumAppearingChoices || 6);
    const range = createMemo(() => {
      const rng = [];
      for (let i = 1; i <= maximumAppearingChoices() + 2; i++) {
        rng.push(i);
      }
      return rng;
    });

    const handleChangePage = (newPage: number, event: MouseEvent) => {
      if (typeof props.onChangePage === 'function') {
        props.onChangePage(newPage, event);
      }
    };

    const getIndexForCurrentPage = () => {
      if (props.current < maximumAppearingChoices()) {
        return props.current;
      } else if (props.total - props.current < maximumAppearingChoices()) { // if its portion includes the first page
        Return props.total - props.current;
      } else {
        return Math.floor(maximumAppearingChoices() / 2);
      }
    }

    const PageNumber = (p: { index: number }) => (
      <Button.Icon
        color={p.index === props.current ? 'primary' : undefined}
        size="small"
        onClick={(e) => handleChangePage(p.index, e)}
      >
        {p.index}
      </Button.Icon>
    );

    return <div {...elProps} class={mergeClass('pagination-container', elProps.class)}>
      <Button.Icon 
        class="back" 
        disabled={props.current === 1}
        size="small"
        onClick={(e) => handleChangePage(props.current - 1, e)}
      > <ArrowBackIosNew /> </Button.Icon>

      <For each={range()}>{
        (index) => (
          <Switch>
            <Match when={(!isInSamePortionAsCurrent(1) && index === 2) 
              || (!isInSamePortionAsCurrent(props.total) && index === range().length - 1 )}>
              <Button.Icon disabled size="small"> <MoreHoriz/> </Button.Icon>
            </Match>
            <Match when={isInSamePortionAsCurrent(index) || index === 1 || index === range().length}>
              <PageNumber index={index}/>
            </Match>
          </Switch>
        )
      }</For>

      <Button.Icon 
        class="next" 
        disabled={props.current === props.total}
        onClick={(e) => handleChangePage(props.current - 1, e)}
        size="small"
      > <ArrowForwardIos /> </Button.Icon>
    </div>;
  },
  ['current', 'total', 'onChangePage']
)

export default Pagination;

