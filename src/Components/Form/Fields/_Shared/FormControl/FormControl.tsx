import type { Component, JSX, ParentProps } from "solid-js";
import { useForm } from "../../../Form";

import './FormControl.scss';

export type FormControlProps = ParentProps<{
  name: string;
  helperText?: JSX.Element;
}>;

const FormControl: Component<FormControlProps> = (props) => {
  const form = useForm();

  return <div 
    class='form-control' 
    classList={{ error: form?.hasErrors(props.name) }}
  >
    {props.children}
    <div class='helper-text'>
      {form?.hasErrors(props.name)
        ? form?.firstErrorFor(props.name)
        : props.helperText}
      &nbsp;
    </div>
  </div>;
};

export default FormControl;
