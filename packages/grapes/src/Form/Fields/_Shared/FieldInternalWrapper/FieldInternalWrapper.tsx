import type { Component, JSX, ParentProps } from "solid-js";
import { useForm } from "../../../Form";

import './FieldInternalWrapper.scss';

export type FieldInternalWrapperProps = ParentProps<{
  name: string;
  helperText?: JSX.Element;

  id?: string;
  class?: string;
  style?: JSX.CSSProperties;
  classList?: Record<string, boolean | undefined>;
}>;

/**
 * @description A integral GrapeS wrapper component that helps with handling 
 * getting the errors from the Form and showing it inplace of the helper text.
 *
 * If there are no errors it just wraps the field's internals and 
 * adds its helper text bellow.
 */
const FieldInternalWrapper: Component<FieldInternalWrapperProps> = (props) => {
  const form = useForm();

  return <div 
    id={props.id}
    class={'field ' + (props.class || '')}
    style={props.style}
    classList={{ 
      error: form?.hasErrors(props.name),
      ...props.classList
    }}
  >
    {props.children}
    <div class='helper-text'>
      {form?.hasErrors(props.name) && !form.isDisabled(props.name)
        ? form?.firstErrorFor(props.name)
        : props.helperText}
      &nbsp;
    </div>
  </div>;
};

export default FieldInternalWrapper;
