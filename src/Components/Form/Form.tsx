import { JSX, onMount, useContext } from "solid-js";
import { produce, SetStoreFunction } from "solid-js/store";

import { 
  AgnosticValidator, 
  FormContext, 
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
export function Form(props: {
  indentification: string,
  formStore: [get: FormStore<any>, set: SetStoreFunction<FormStore<any>>],
  agnosticValidators?: AgnosticValidator[],
  children: JSX.Element[] | JSX.Element
}): JSX.Element {
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
