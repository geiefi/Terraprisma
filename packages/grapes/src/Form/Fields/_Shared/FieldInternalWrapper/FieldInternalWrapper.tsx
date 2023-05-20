import { Component, createContext, createEffect, createMemo, JSX, ParentProps, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { useForm } from "../../../Form";
import { FieldValidator, FieldValue, Store } from "../../../FormContext";

import './FieldInternalWrapper.scss';

export type FieldInternalWrapperProps = ParentProps<{
  name: string;
  errors: string[] | undefined,

  isDisabled: boolean | undefined;

  helperText: JSX.Element | undefined;

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
      class={'field ' + (props.class || '')}
      style={props.style}
      onClick={props.onClick}
      classList={{
        error: hasErrors(),
        ...props.classList
      }}
    >
      {props.children}
      <div class='helper-text'>
        <Show
          when={hasErrors() && !props.isDisabled}
          fallback={props.helperText}
        >
          {props.errors![0]}
        </Show>
        &nbsp;
      </div>
    </div>;
};

export default FieldInternalWrapper;

