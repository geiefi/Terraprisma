import { JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { forwardNativeElementProps } from '../../Helpers';

import Box from '../Box/Box';
import Button from '../Button/Button';
import { Fade } from '../../Transitions';

import './Modal.scss';
import { useTheme } from '../../GrapeS';
import { mergeClass } from '../../_Shared/Utils';
import { Divisor } from '../../Layout';
import { GetProps } from '../../Helpers/Types/GetProps';

export interface ModalProps {
  visible?: boolean;

  title: JSX.Element;
  children: JSX.Element;

  extraElementsInFooter?: JSX.Element;

  onOk?: (event: MouseEvent) => any;
  onCancel?: (event: MouseEvent) => any;
}

const Modal = forwardNativeElementProps<
  ModalProps,
  HTMLDivElement,
  GetProps<typeof Box>
>(
  (props, elProps) => {
    const { grapesGlobalDivRef } = useTheme()!;

    return (
      <Portal mount={grapesGlobalDivRef()}>
        <Fade>
          <Show when={props.visible}>
            <div
              class="modal-backdrop"
              onClick={(event) =>
                props.onCancel ? props.onCancel(event as any) : undefined
              }
            >
              <Box
                depth={1}
                {...elProps}
                class={mergeClass('modal-box', elProps.class)}
              >
                <div class="header">{props.title}</div>

                <Divisor />

                <div class="body">{props.children}</div>

                <Divisor />

                <div class="footer">
                  {props.extraElementsInFooter}

                  <div class="actions">
                    <Button.Empty
                      onClick={(event) => {
                        if (props.onOk) {
                          event.stopPropagation();
                          props.onOk(event);
                        }
                      }}
                    >
                      Cancel
                    </Button.Empty>
                    <Button
                      onClick={(event) => {
                        if (props.onCancel) {
                          event.stopPropagation();
                          props.onCancel(event);
                        }
                      }}
                      color="primary"
                    >
                      Ok
                    </Button>
                  </div>
                </div>
              </Box>
            </div>
          </Show>
        </Fade>
      </Portal>
    );
  },
  ['title', 'extraElementsInFooter', 'visible', 'onOk', 'onCancel', 'children'],
);

export default Modal;
