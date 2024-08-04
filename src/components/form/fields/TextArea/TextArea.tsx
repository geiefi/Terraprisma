import {
  ComponentProps,
  JSX,
  createEffect,
  createSignal,
  splitProps
} from 'solid-js';

import { mergeRefs } from '@solid-primitives/refs';

import './TextArea.css';
import {
  Accents,
  FieldRequiredProperties,
  FieldRequiredPropertyKeys
} from '../../../..';
import { mergeClass, mergeEventHandlers } from '../../../../utils';
import { InputLikeBase } from '../../components';
import { LeftIntersection } from '../../../../types/LeftIntersection';
import { createValueSignal } from '../createValueSignal';

export type TextAreaChangeEvent = Event & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export type TextAreaProps = LeftIntersection<
  {
    label?: JSX.Element;

    size?: 'small' | 'medium' | 'large';

    /**
     * @default true
     */
    resizable?: boolean;
    color?: Accents;
    /**
     * @default 'both' or 'none' if {@link resizable} is false
     */
    reisizingDrection?: JSX.CSSProperties['resize'];
  } & FieldRequiredProperties<string>,
  ComponentProps<'textarea'>
>;

const TextArea = (allProps: TextAreaProps) => {
  const [props, elProps] = splitProps(allProps, [
    ...FieldRequiredPropertyKeys,
    'label',
    'color',
    'resizable',
    'size',
    'reisizingDrection',
    'onChange'
  ]);
  const color = () => props.color ?? 'accent';

  const [value, setValue] = createValueSignal(props);
  const [focused, setFocused] = createSignal(false);

  const resizingDirection = () =>
    props.resizable ?? true ? props.reisizingDrection ?? 'both' : 'none';
  let textarea: HTMLTextAreaElement;
  createEffect(() => {
    if (textarea) {
      textarea.value = (value() ?? '').toString();
    }
  });

  const hasContent = () =>
    value() !== undefined && value()!.toString().length > 0;

  return (
    <InputLikeBase
      class="max-w-full max-h-full w-full h-full overflow-x-hidden overflow-y-auto"
      style={{
        resize: resizingDirection()
      }}
      size={props.size}
      hasErrors={props.isInvalid}
      hasContent={hasContent()}
      focused={focused()}
      color={color()}
      label={props.label}
    >
      <textarea
        {...elProps}
        ref={mergeRefs(elProps.ref, (r) => (textarea = r))}
        disabled={props.disabled}
        class={mergeClass(
          'border-none outline-none appearance-none bg-transparent w-full h-full min-h-full m-0 pt-[inherit] pb-[inherit] pl-[inherit] pr-[inherit] absolute left-0 top-0',
          'overflow-hidden box-border resize-none transition-opacity opacity-100',
          typeof props.label === 'undefined' && 'py-2',
          !focused() && !hasContent() && '!opacity-0',
          elProps.class
        )}
        onInput={mergeEventHandlers(
          elProps.onInput,
          //props.mask ? createInputMask(props.mask) : undefined,
          (event) => {
            event.target.style.height = '0px';
            requestAnimationFrame(() => {
              const scrollHeight = Math.max(
                event.target.scrollHeight,
                event.target.parentElement!.getBoundingClientRect().height - 2
              );
              event.target.style.height = `${scrollHeight}px`;
            });

            setValue(event.currentTarget.value);
          }
        )}
        onFocus={mergeEventHandlers(elProps.onFocus, () => setFocused(true))}
        onBlur={mergeEventHandlers(elProps.onBlur, () => {
          setFocused(false);
        })}
      />
    </InputLikeBase>
  );
};

export default TextArea;
