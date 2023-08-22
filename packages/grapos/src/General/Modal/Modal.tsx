import { ComponentProps, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { forwardNativeElementProps } from '../../Helpers';

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

  onOk?: ComponentProps<'button'>['onClick'];
  onCancel?: ComponentProps<'button'>['onClick'];
}

const Modal = forwardNativeElementProps<ModalProps, HTMLDivElement>(
  (props, elProps) => {
    const { grapesGlobalDivRef } = useTheme()!;

    return (
      <Portal mount={grapesGlobalDivRef()}>
        <Fade>
          <Show when={props.visible}>
            <div class="modal-backdrop">
              <Box
                {...elProps}
                class={mergeClass('modal-box', elProps.class)}
                depth={1}
              >
                <div class="header">{props.title}</div>

                <Divisor />

                <div class="body">{props.children}</div>

                <Divisor />

                <div class="footer">
                  {props.extraElementsInFooter}

                  <div class="actions">
                    <Button.Empty onClick={props.onOk}>Cancel</Button.Empty>
                    <Button onClick={props.onCancel} color="primary">
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
