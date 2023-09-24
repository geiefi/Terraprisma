import {
  ComponentProps,
  JSX,
  Show,
  createMemo,
  createRoot,
  createSignal
} from 'solid-js';
import { Portal, insert } from 'solid-js/web';

import {
  mergeClass,
  mergeCallbacks,
  makeComponent,
  extendPropsFrom
} from '@terraprisma/utils';
import { Fade } from '@terraprisma/transitions';
import { Divisor } from '@terraprisma/layout';

import Box from './Box';
import Button from './Buttons/Button';
import OutlinedButton from './Buttons/OutlinedButton';

export interface ModalProps {
  visible?: boolean;

  title: JSX.Element;
  children: JSX.Element;

  extraElementsInFooter?: JSX.Element;

  onOk?: (event: MouseEvent) => any;
  onCancel?: (event: MouseEvent) => any;

  onHidden?: () => any;
}

const ModalInternal = makeComponent(
  [
    extendPropsFrom<ModalProps, typeof Box>([
      'title',
      'extraElementsInFooter',
      'visible',
      'onOk',
      'onHidden',
      'onCancel',
      'children'
    ])
  ],
  (props, elProps) => (
    <Fade onAfterExit={() => props.onHidden && props.onHidden()}>
      <Show when={props.visible}>
        <div
          class={mergeClass(
            'absolute left-0 top-0 w-screen h-screen z-20 bg-black/40 backdrop-blur',
            !props.visible && 'pointer-events-none'
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
              'absolute left-1/2 top-1/2 w-full h-fit max-w-[568px] translate-x-1/2 translate-y-1/2 border-none',
              elProps.class
            )}
          >
            <div class="header">{props.title}</div>

            <Divisor />

            <div class="body">{props.children}</div>

            <Divisor />

            <div class="flex flex-row w-full">
              {props.extraElementsInFooter}

              <div class="ml-auto flex gap-4 &>*">
                <OutlinedButton
                  class="h-full"
                  color="danger"
                  onClick={props.onCancel}
                >
                  Cancel
                </OutlinedButton>
                <Button class="h-full" onClick={props.onOk} color="accent">
                  Ok
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </Show>
    </Fade>
  )
);

const Modal = (props: ComponentProps<typeof ModalInternal>) => {
  return (
    <Portal>
      <ModalInternal {...props} />
    </Portal>
  );
};

export default Modal;

export interface CreateModalOptions
  extends Omit<ComponentProps<typeof ModalInternal>, 'visible' | 'children'> {
  identification: string;

  body: JSX.Element;
  ref?: HTMLDivElement | ((modal: HTMLDivElement) => any);
}

export function createModal(options: CreateModalOptions) {
  createRoot((dispose) => {
    const container = document.createElement('div');

    const [isModalVisible, setModalVisible] = createSignal(false);
    const modal = createMemo(() => (
      <ModalInternal
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
      </ModalInternal>
    ));

    // eslint-disable-next-line solid/reactivity
    insert(container, modal);

    document.body.appendChild(container);

    setModalVisible(true);
  });
}
