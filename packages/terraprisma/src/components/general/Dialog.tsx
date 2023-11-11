import {
  ComponentProps,
  JSX,
  Show,
  createMemo,
  createRoot,
  createSignal
} from 'solid-js';
import { Portal, insert } from 'solid-js/web';

import Box from './Box';
import Button from './Buttons/Button';
import OutlinedButton from './Buttons/OutlinedButton';
import { componentBuilder, extendPropsFrom, mergeClass, mergeCallbacks } from '../../utils';
import { Divisor } from '../layout';
import { Fade } from '../transitions';

export interface DialogProps {
  visible?: boolean;

  title: JSX.Element;
  children: JSX.Element;

  extraElementsInFooter?: JSX.Element;

  onOk?: (event: MouseEvent) => any;
  onCancel?: (event: MouseEvent) => any;

  onHidden?: () => any;
}

const DialogInternal = componentBuilder<DialogProps>()
  .factory(
    extendPropsFrom<DialogProps, typeof Box>([
      'title',
      'extraElementsInFooter',
      'visible',
      'onOk',
      'onHidden',
      'onCancel',
      'children'
    ])
  )
  .create((props, elProps) => (
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
              'absolute left-1/2 top-1/2 w-full h-fit max-w-[568px] translate-x-[-50%] translate-y-[-50%]',
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
  ));

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
