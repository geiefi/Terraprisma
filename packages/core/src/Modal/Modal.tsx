import {
  ComponentProps,
  JSX,
  Show,
  createMemo,
  createRoot,
  createSignal
} from 'solid-js';
import { Portal, insert } from 'solid-js/web';

import { getGlobalWrapper } from '../ThemeProvider';

import {
  mergeClass,
  mergeCallbacks,
  makeComponent,
  extendPropsFrom
} from '@terraprisma/utils';

import Box from '../Box/Box';
import Button from '../Button/Button';
import { Fade } from '@terraprisma/transitions';
import { Divisor } from '@terraprisma/layout';

import './Modal.scss';

export interface CreateModalOptions
  extends Omit<ComponentProps<typeof ModalInternal>, 'visible' | 'children'> {
  identification: string;

  body: JSX.Element;
  ref?: HTMLDivElement | ((modal: HTMLDivElement) => any);
}

export function createModal(options: CreateModalOptions) {
  createRoot((dispose) => {
    const terraprismaGlobalDiv = getGlobalWrapper();

    const container = document.createElement('div');

    const [isModalVisible, setModalVisible] = createSignal(false);
    const modal = createMemo(() => (
      <ModalInternal
        {...options}
        visible={isModalVisible()}
        onHidden={() => {
          terraprismaGlobalDiv.removeChild(container);
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

    terraprismaGlobalDiv.appendChild(container);

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
                <Button color="danger" onClick={props.onCancel}>
                  Cancel
                </Button>
                <Button onClick={props.onOk} color="accent">
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
  const terraprismaGlobalDiv = getGlobalWrapper();

  return (
    <Portal mount={terraprismaGlobalDiv}>
      <ModalInternal {...props} />
    </Portal>
  );
};

export default Modal;
