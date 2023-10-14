import { JSX, ParentProps, Show, createSignal } from 'solid-js';

import {
  extendPropsFrom,
  makeComponent,
  mergeCallbacks,
  mergeClass
} from '@terraprisma/utils';
import { Accents, addAccentColoring } from '@terraprisma/theming';
import { Collapse } from '@terraprisma/transitions';
import { KeyboardArrowDown } from '@terraprisma/icons';

import ListItem from './ListItem';

export interface ListItemWithDetailsProps extends ParentProps {
  /**
   * @default false
   */
  disabled?: boolean;

  style?: JSX.CSSProperties;

  onShowDetails?: () => any;
  details: JSX.Element;
}

const ListItemWithDetails = makeComponent(
  [
    addAccentColoring<ListItemWithDetailsProps>(),
    extendPropsFrom<ListItemWithDetailsProps & { color?: Accents }, 'li'>([
      'children',
      'color',
      'details',
      'onShowDetails',
      'disabled'
    ])
  ],
  (props, color, elProps) => {
    const [isDetailsOpen, setDetailsOpen] = createSignal(false);

    return (
      <>
        <ListItem
          {...elProps}
          class={mergeClass('relative', elProps.class)}
          color={color()}
          clickable
          onClick={mergeCallbacks(elProps.onClick, () =>
            setDetailsOpen((isOpen) => !isOpen)
          )}
          disabled={props.disabled}
        >
          {props.children}

          <span
            class={mergeClass(
              'absolute right-2.5 top-1/2 translate-y-[-50%] origin-center transition-transform',
              isDetailsOpen() && 'rotate-180'
            )}
          >
            <KeyboardArrowDown />
          </span>
        </ListItem>

        <Collapse>
          <Show when={isDetailsOpen()}>
            <div class="w-full h-fit pl-0 m-0">{props.details}</div>
          </Show>
        </Collapse>
      </>
    );
  }
);

export default ListItemWithDetails;
