import { createEventListenerMap } from '@solid-primitives/event-listener';
import { Accessor, createEffect } from 'solid-js';

export function createDismissListener({
  onDismiss,
  nonDismissingElements
}: {
  onDismiss: (event: FocusEvent | PointerEvent) => any;
  nonDismissingElements?: Accessor<(Element | undefined)[]>;
}) {
  createEffect(() => {
    for (const element of nonDismissingElements?.() ?? []) {
      if (element !== undefined) {
        createEventListenerMap(
          element,
          {
            pointerdown: (event) => {
              event.stopImmediatePropagation();
            },
            focus: (event) => {
              event.stopImmediatePropagation();
            }
          }
        );
      }
    }
  });

  return {
    // we wait until the element is actually mounted and rendered to then attach the event
    // listeners to avoid them being created before the element actually exists and causing
    // flickering between enabled states because they are being dismissed by a focus/click
    // on the triggert
    ref: (element: Element) => {
      let isDismissableElementFocused = false;
      let wasPointerDownOnDismissableElement = false;

      createEventListenerMap(
        element,
        {
          pointerdown() {
            wasPointerDownOnDismissableElement = true;
          },
          focus() {
            isDismissableElementFocused = true;
          },
          blur() {
            isDismissableElementFocused = false;
          }
        },
        { capture: true }
      );

      // since this event will be bubbling, the isDismissableElementFocused will be
      // updated by now if it has been unfocused or focused
      createEventListenerMap(document, {
        focusin: (event) => {
          if (!isDismissableElementFocused) {
            onDismiss(event);
          }
        },
        pointerdown: (event) => {
          if (!wasPointerDownOnDismissableElement) {
            onDismiss(event);
          }
          wasPointerDownOnDismissableElement = false;
        }
      }, { capture: false });
    }
  };
}
