import {
  ComponentProps,
  JSX,
  Show,
  createMemo,
  createRoot,
  createSignal,
  splitProps
} from 'solid-js';
import { Portal, insert } from 'solid-js/web';

import Box from './Box';
import Button from './Buttons/Button';
import OutlinedButton from './Buttons/OutlinedButton';
import {
  mergeClass,
  mergeCallbacks
} from '../../utils';
import { Divisor } from '../layout';
import { Fade } from '../transitions';
import { LeftIntersection } from '../../types/LeftIntersection';

export type DialogProps = LeftIntersection<
  {
    visible?: boolean;

    title: JSX.Element;
    children: JSX.Element;

    extraElementsInFooter?: JSX.Element;

    onOk?: (event: MouseEvent) => any;
    onCancel?: (event: MouseEvent) => any;

    onHidden?: () => any;
  },
  ComponentProps<typeof Box>
>;

const DialogInternal = (allProps: DialogProps) => {
  const [props, elProps] = splitProps(allProps, [
    'title',
    'extraElementsInFooter',
    'visible',
    'onOk',
    'onHidden',
    'onCancel',
    'children'
  ]);
  return (
    <Fade onAfterExit={() => props.onHidden && props.onHidden()}>
      <Show when={props.visible}>
        <div
          class={mergeClass(
            'tp-absolute tp-left-0 tp-top-0 tp-w-screen tp-h-screen tp-z-20 tp-bg-black/40 tp-backdrop-blur',
            !props.visible && 'tp-pointer-events-none'
          )}
          classList={{
            visible: props.visible
          }}
          onClick={(event) =>
            props.onCancel && props.visible
              ? props.onCancel(event as any)
              : undefined
          }
        >
          <Box
            {...elProps}
            onClick={mergeCallbacks(
              elProps.onClick as any,
              (event: MouseEvent) => {
                event.stopPropagation();
              }
            )}
            class={mergeClass(
              'tp-absolute tp-left-1/2 tp-top-1/2 tp-w-full tp-h-fit tp-max-w-[568px] tp-translate-x-[-50%] tp-translate-y-[-50%]',
              elProps.class
            )}
          >
            <div class="header">{props.title}</div>

            <Divisor />

            <div class="body">{props.children}</div>

            <Divisor />

            <div class="tp-flex tp-flex-row tp-w-full">
              {props.extraElementsInFooter}

              <div class="tp-ml-auto tp-flex tp-gap-4 &>*">
                <OutlinedButton
                  class="tp-h-full"
                  color="danger"
                  onClick={props.onCancel}
                >
                  Cancel
                </OutlinedButton>
                <Button class="tp-h-full" onClick={props.onOk} color="accent">
                  Ok
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </Show>
    </Fade>
  );
};

const Dialog = (props: ComponentProps<typeof DialogInternal>) => {
  return (
    <Portal>
      <DialogInternal {...props} />
    </Portal>
  );
};

export default Dialog;

export interface CreateModalOptions
  extends Omit<ComponentProps<typeof DialogInternal>, 'visible' | 'children'> {
  identification: string;

  body: JSX.Element;
  ref?: HTMLDivElement | ((modal: HTMLDivElement) => any);
}

export function createDialog(options: CreateModalOptions) {
  createRoot((dispose) => {
    const container = document.createElement('div');

    const [isModalVisible, setModalVisible] = createSignal(false);
    const modal = createMemo(() => (
      <DialogInternal
        {...options}
        visible={isModalVisible()}
        onHidden={() => {
          document.body.removeChild(container);
          dispose();
        }}
        onOk={(...args) => {
          setModalVisible(false);
          if (options.onOk) {
            options.onOk(...args);
          }
        }}
        onCancel={(...args) => {
          setModalVisible(false);
          if (options.onCancel) {
            options.onCancel(...args);
          }
        }}
      >
        {options.body}
      </DialogInternal>
    ));

    // eslint-disable-next-line solid/reactivity
    insert(container, modal);

    document.body.appendChild(container);

    setModalVisible(true);
  });
}
