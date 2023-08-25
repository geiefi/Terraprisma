import { ParentProps, Show, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { createComponentExtendingFromOther } from '@grapos/utils';
import { Divisor } from '@grapos/layout';

import './Title.scss';

export interface TitleProps extends ParentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  center?: boolean;

  /**
   * @default `true` if {@link as} is h1 or h2.
   */
  showDivisor?: boolean;
}

const Title = createComponentExtendingFromOther<TitleProps, 'h1'>(
  (props, elProps) => {
    const element = createMemo(() => props.as ?? 'h1');

    const shouldShowDivisor = createMemo(() =>
      typeof props.showDivisor === 'undefined'
        ? ['h1', 'h2'].includes(element())
        : props.showDivisor
    );

    return (
      <>
        <Dynamic
          component={'h1'}
          {...elProps}
          classList={{
            'header-1': element() === 'h1',
            'header-2': element() === 'h2',
            'header-3': element() === 'h3',
            'header-4': element() === 'h4',
            'header-5': element() === 'h5',
            'header-6': element() === 'h6',
            center: props.center,
            ...elProps.classList
          }}
        >
          {props.children}
        </Dynamic>
        <Show when={shouldShowDivisor()}>
          <Divisor />
        </Show>
      </>
    );
  },
  ['children', 'center', 'showDivisor', 'as']
);

export default Title;
