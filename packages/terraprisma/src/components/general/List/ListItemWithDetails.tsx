import {
  Accessor,
  ComponentProps,
  JSX,
  Setter,
  Show,
  createEffect,
  createSignal,
  on,
  splitProps
} from 'solid-js';

import ListItem from './ListItem';
import { Accents } from '../../..';
import { mergeClass, mergeCallbacks } from '../../../utils';
import { KeyboardArrowDown } from '../../icons';
import { Collapse } from '../../transitions';
import { LeftIntersection } from '../../../types/LeftIntersection';

export type ListItemWithDetailsProps = LeftIntersection<
  {
    /**
     * @default false
     */
    disabled?: boolean;

    /**
     * @default false
     */
    active?: boolean;

    color?: Accents;

    children?: JSX.Element;

    style?: JSX.CSSProperties;

    showingDetails?: boolean;

    details: JSX.Element;
  },
  ComponentProps<'li'>
>;

const ListItemWithDetails = (allProps: ListItemWithDetailsProps) => {
  const [props, elProps] = splitProps(allProps, [
    'children',
    'color',
    'details',
    'active',
    'showingDetails',
    'style',
    'disabled'
  ]);

  const color = () => props.color ?? 'accent';

  let isDetailsOpen: Accessor<boolean> = () => false;
  let setDetailsOpen: Setter<boolean> | undefined;
  createEffect(() => {
    if (typeof props.showingDetails !== 'undefined') {
      // eslint-disable-next-line solid/reactivity
      isDetailsOpen = () => props.showingDetails!;
      setDetailsOpen = undefined;
    } else {
      const [_isDetailsOpen, _setDetailsOpen] = createSignal(false);
      isDetailsOpen = _isDetailsOpen;
      setDetailsOpen = _setDetailsOpen;
    }
  });

  return (
    <>
      <ListItem
        {...elProps}
        class={mergeClass('relative', elProps.class)}
        color={color()}
        active={props.active}
        style={props.style}
        clickable
        onClick={mergeCallbacks(elProps.onClick, () => {
          if (typeof props.showingDetails === 'undefined' && setDetailsOpen) {
            setDetailsOpen((isOpen) => !isOpen);
          }
        })}
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
        <Show when={isDetailsOpen()}>{props.details}</Show>
      </Collapse>
    </>
  );
};

export default ListItemWithDetails;
