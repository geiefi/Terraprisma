import { JSX } from "solid-js";
import { createForm, FieldName, FieldProps, acknowledgeFieldComponent, FormValue } from "terraprisma";

type Value = {
  name: string;
  password: string;
  verificationCode: number;
  date: Date;
};

type MyCustomFieldProps<Value extends FormValue = FormValue, Name extends FieldName<Value, Date> = FieldName<Value, Date>> = FieldProps<Value, Date, Name>;
function MyCustomField(props: MyCustomFieldProps) {
  return <>Hello baby</>;
}

acknowledgeFieldComponent('MyCustomField', MyCustomField);

declare module 'terraprisma' {
  interface Form<Value extends FormValue> {
    MyCustomField: <Name extends FieldName<Value, Date>>(props: MyCustomFieldProps<Value, Name>) => JSX.Element;
  }
}

export default function CreateFormTesting() {
  const Form = createForm<Value>('', {});

  return <Form.MyCustomField name="date" />;
}
