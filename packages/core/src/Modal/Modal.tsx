import {
  ComponentProps,
  JSX,
  Show,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  onMount
} from 'solid-js';
import { Portal, insert } from 'solid-js/web';

import { GrapeSGlobalDivID, getGrapeSGlobalDiv } from '../GrapeS';

import {
  createComponentExtendingFromOther,
  mergeClass,
  mergeCallbacks
} from '@grapos/utils';

import Box from '../Box/Box';
import Button from '../Button/Button';
import { Fade } from '@grapos/transitions';
import { Divisor } from '@grapos/layout';

import './Modal.scss';

export interface CreateModalOptions
  extends Omit<ComponentProps<typeof ModalInternal>, 'visible' | 'children'> {
  identification: string;

  body: JSX.Element;
  ref?: HTMLDivElement | ((modal: HTMLDivElement) => any);
}

export function createModal(options: CreateModalOptions) {
  createRoot((dispose) => {
    const grapesGlobalDiv = getGrapeSGlobalDiv();

    const container = document.createElement('div');

    const [isModalVisible, setModalVisible] = createSignal(false);
    const modal = createMemo(() => (
      <ModalInternal
        {...options}
        visible={isModalVisible()}
        onHidden={() => {
          grapesGlobalDiv.removeChild(container);
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

    grapesGlobalDiv.appendChild(container);

    setModalVisible(true);
  });
}

export interface ModalProps {
  visible?: boolean;

  title: JSX.Element;
  children: JSX.Element;

  extraElementsInFooter?: JSX.Element;

  onOk?: (event: MouseEvent) => any;
  onCancel?: (event: MouseEvent) => any;

  onHidden?: () => any;
}

const ModalInternal = createComponentExtendingFromOther<
  ModalProps,
  'div',
  ComponentProps<typeof Box>
>(
  (props, elProps) => (
    <Fade onAfterExit={() => props.onHidden && props.onHidden()}>
      <Show when={props.visible}>
        <div
          class="modal-backdrop"
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
            depth={1}
            {...elProps}
            onClick={mergeCallbacks(
              elProps.onClick as any,
              (event: MouseEvent) => {
                event.stopPropagation();
              }
            )}
            class={mergeClass('modal-box', elProps.class)}
          >
            <div class="header">{props.title}</div>

            <Divisor />

            <div class="body">{props.children}</div>

            <Divisor />

            <div class="footer">
              {props.extraElementsInFooter}

              <div class="actions">
                <Button.Empty onClick={props.onCancel}>Cancel</Button.Empty>
                <Button onClick={props.onOk} color="primary">
                  Ok
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </Show>
    </Fade>
  ),
  [
    'title',
    'extraElementsInFooter',
    'visible',
    'onOk',
    'onHidden',
    'onCancel',
    'children'
  ]
);

const Modal = (props: ComponentProps<typeof ModalInternal>) => {
  const grapesGlobalDiv = getGrapeSGlobalDiv();

  return (
    <Portal mount={grapesGlobalDiv}>
      <ModalInternal {...props} />
    </Portal>
  );
};

export default Modal;
