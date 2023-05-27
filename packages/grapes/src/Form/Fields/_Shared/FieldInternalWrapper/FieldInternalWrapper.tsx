import { Component, createMemo, JSX, ParentProps, Show } from "solid-js";
import { mergeClass } from "../../../../_Shared/Utils";

import './FieldInternalWrapper.scss';

export type FieldInternalWrapperProps = ParentProps<{
  name: string;
  errors: string[] | undefined,

  isDisabled: boolean | undefined;

  helperText: JSX.Element | undefined;

  renderHelperText?: boolean;

  id?: string;
  class?: string;
  style?: JSX.CSSProperties;
  classList?: Record<string, boolean | undefined>;

  onClick?: (event: MouseEvent) => any;
}>;

/**
 * @description A integral GrapeS wrapper component that helps with handling 
 * getting the errors from the Form and showing it inplace of the helper text.
 *
 * If there are no errors it just wraps the field's internals and 
 * adds its helper text bellow.
 */
const FieldInternalWrapper: Component<FieldInternalWrapperProps> = (props) => {
  const hasErrors = createMemo(
    // doing it like this to track the first errors
    () => props.errors && Array.isArray(props.errors) && typeof props.errors[0] !== 'undefined'
  );

  return <div
    id={props.id}
    class={mergeClass('field', props.class)}
    style={props.style}
    onClick={props.onClick}
    classList={{
      error: hasErrors(),
      ...props.classList
    }}
  >
    {props.children}
    <Show when={typeof props.renderHelperText === 'undefined' || props.renderHelperText === true}>
      <div class='helper-text'>
        <Show
          when={hasErrors() && !props.isDisabled}
          fallback={props.helperText}
        >
          {props.errors![0]}
        </Show>
        &nbsp;
      </div>
    </Show>
  </div>;
};

export default FieldInternalWrapper;

