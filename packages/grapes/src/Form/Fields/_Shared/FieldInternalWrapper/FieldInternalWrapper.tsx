import { Component, createMemo, JSX, Show, splitProps } from "solid-js";
import { mergeClass } from "../../../../_Shared/Utils";

import './FieldInternalWrapper.scss';

export interface FieldInternalWrapperProps extends JSX.HTMLAttributes<HTMLDivElement> {
  name: string;
  errors: string[] | undefined,

  isDisabled: boolean | undefined;

  helperText: JSX.Element | undefined;
  renderHelperText?: boolean;
};

/**
 * @description A integral GrapeS wrapper component that helps with handling 
 * getting the errors from the Form and showing it inplace of the helper text.
 *
 * If there are no errors it just wraps the field's internals and 
 * adds its helper text bellow.
 */
const FieldInternalWrapper: Component<FieldInternalWrapperProps> = (allProps) => {
  const [props, elProps] = splitProps(
    allProps, 
    ['name', 'errors', 'isDisabled', 'helperText', 'renderHelperText']
  );

  const hasErrors = createMemo(
    // doing it like this to track the first errors
    () => props.errors && Array.isArray(props.errors) && typeof props.errors[0] !== 'undefined'
  );

  return <div
    {...elProps}
    class={mergeClass('field', elProps.class)}
    classList={{
      error: hasErrors(),
      ...elProps.classList
    }}
  >
    {elProps.children}

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

