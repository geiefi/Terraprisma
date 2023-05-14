import { createEffect, JSX, on, onCleanup, onMount, ParentProps, useContext } from "solid-js";
import { createStore, produce, SetStoreFunction } from "solid-js/store";

import {
  AgnosticValidator,
  FormContext,
  FormError,
  FormProviderValue,
  FormStore,
  FormValue
} from "./FormContext";

/**
 * @description A component used for managing the values of the form through the provided Store,
 * validating and managing the errors as necessary.
 *
 * @example 
 * ```tsx
 * type MyFormValue = Partial<{
 *   email: string;
 * }>;
 *
 * const App = () => {
 *  const formStore = createStore<FormStore<MyFormValue>>(new FormStore(
 *    { // here goes the initial values of your form
 *      email: 'my@email.com'
 *    }
 *  ));
 *
 *  return <Form 
 *    identification='My Form' 
 *    formStore={formStore}
 *  >
 *    ...
 *  </Form>;
 * };
 * ```
 */
const Form = (props: ParentProps<{
  indentification: string,
  formStore: [get: FormStore<any>, set: SetStoreFunction<FormStore<any>>],
  agnosticValidators?: AgnosticValidator[],
}>): JSX.Element => {
  const [form, setForm] = props.formStore;

  onMount(() => {
    setForm(produce(form => {
      form.errors = {};
    }));
  });

  return <FormContext.Provider value={new FormProviderValue(
    [form, setForm],
    props.agnosticValidators || [],
    props.indentification
  )}>
    {props.children}
  </FormContext.Provider>;
}

/**
 * @description Does basically the same as the <Form> component,
 * but is made to be used inside of a <Form> and it acts as a proxy between the fields
 * and an object field inside the values of the <Form>.
 */
const innerForm = (props: ParentProps<{
  identification: string,
  /**
   * This name is **NOT** the identification of the component, it rather is the field name inside
   * of the values of the parent <Form>
   */
  name: string,
  agnosticValidators?: AgnosticValidator[],
}>) => {
  const form = useForm();

  if (typeof form === 'undefined') {
    throw new FormError(
      `Error with the <Form.Inner> called "${props.identification}": ` +
      'Cannot have a <Form.Inner> component if it is not inside a <Form> component!'
    );
  }

  const [innerForm, setInnerForm] = createStore<FormStore<any>>(new FormStore({}));
  const innerFormProvider = new FormProviderValue(
    [innerForm, setInnerForm],
    props.agnosticValidators || [],
    props.identification,
  );

  onMount(() => {
    if (typeof form.valueFor(props.name) !== 'undefined') {
      form.cleanUp(props.name);
    }

    form.init(props.name, [], {} as any);
  });

  innerFormProvider.onChange(newValues => {
    form.update(props.name, newValues);
  });

  form.onFieldChange(props.name, newValuesFromParent => {
    if (JSON.stringify(innerForm.values) !== JSON.stringify(newValuesFromParent)) {
      setInnerForm(produce(innerForm => {
        innerForm.values = newValuesFromParent;
      }));
    }
  });

  onCleanup(() => {
    form.cleanUp(props.name);
  });

  return <FormContext.Provider value={innerFormProvider}>
    {props.children}
  </FormContext.Provider>;
};

Form.Inner = innerForm;

/**
 * Gets a reference to the context of the parent form, this is mainly going
 * to be used inside of internal FoxPox components.
 *
 * The provider value that gets out of this function is precisely a class that has implemented methods
 * that help with validating, cleaninUp and managing all of the values of the form.
 */
export function useForm<K extends FormValue = FormValue>() {
  return useContext<FormProviderValue<FormValue> | undefined>(
    FormContext
  ) as unknown as FormProviderValue<K>;
}

export default Form;
