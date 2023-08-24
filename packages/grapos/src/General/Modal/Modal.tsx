import { ComponentProps, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { forwardComponentProps, mergeCallbacks } from '../../Helpers';

import Box from '../Box/Box';
import Button from '../Button/Button';
import { Fade } from '../../Transitions';

import './Modal.scss';
import { useTheme } from '../../GrapeS';
import { mergeClass } from '../../_Shared/Utils';
import { Divisor } from '../../Layout';

export interface ModalProps {
  visible?: boolean;

  title: JSX.Element;
  children: JSX.Element;

  extraElementsInFooter?: JSX.Element;

  onOk?: (event: MouseEvent) => any;
  onCancel?: (event: MouseEvent) => any;
}

const Modal = forwardComponentProps<
  ModalProps,
  'div',
  ComponentProps<typeof Box>
>(
  (props, elProps) => {
    const { grapesGlobalDivRef } = useTheme()!;

    return (
      <Portal mount={grapesGlobalDivRef()}>
        <Fade>
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
      </Portal>
    );
  },
  ['title', 'extraElementsInFooter', 'visible', 'onOk', 'onCancel', 'children']
);

export default Modal;
