import { JSX, ParentProps, onMount, useContext } from 'solid-js';
import {
  SetStoreFunction,
  createStore,
  produce
} from 'solid-js/store';

import { FormContext, FormProviderValue, FormStore } from './FormContext';

import { AgnosticValidator, FormValue } from './types';
import { StoreTuple } from '../../types';

/**
 * @description This is a Form pattern of usage that makes it possible to have typesafe fields
 * based on their field names.
 * This creates Solid's component functions procedurally with the type parameter of the names.
 * This also makes it simpler to use in the end since you don't need to create the store for the form's state.
 *
 * This is a component used for managing the values of a form through a store created inside this function,
 * validating and managing the errors as necessarily.
 *
 * @example
 * ```tsx
 * type MyFormValue = {
 *   email: string;
 * };
 *
 * const App = () => {
 *  // this automatically determines all fields and fields of objects inside it at the type domain
 *  // so that the types are all safe
 *  const MyForm = createForm<MyFormValue>(
 *    'MySuperFormIdentification'
 *    { // here goes the initial values of your form
 *      email: 'my@email.com'
 *    }
 *  );
 *
 *  return <MyForm>
 *    <MyForm.Input name='email' validators={[Validators.email]}/>
 *  </MyForm>;
 * };
 * ```
 */
export function createForm<Value extends FormValue>(
  identification: string,
  initialValueOrStoreTuple:
    | Partial<Value>
    | [get: Partial<Value>, set: SetStoreFunction<Partial<Value>>] = {},
  agnosticValidators: AgnosticValidator[] = []
) {
  let formValue: Partial<Value>;
  let setFormValue: SetStoreFunction<Partial<Value>>;

  if (Array.isArray(initialValueOrStoreTuple)) {
    [formValue, setFormValue] = initialValueOrStoreTuple;
  } else {
    // eslint-disable-next-line solid/reactivity
    const valueStore = createStore(initialValueOrStoreTuple);
    formValue = valueStore[0];
    setFormValue = valueStore[1];
  }

  // eslint-disable-next-line solid/reactivity
  const formStore = createStore(new FormStore());

  const formProviderValue = new FormProviderValue<Value>(
    formStore,
    [formValue, setFormValue],
    agnosticValidators,
    identification
  );

  const form = (props: ParentProps) => (
    <Form<Value> providerValue={formProviderValue}>{props.children}</Form>
  );

  form.store = formStore;
  form.valuesStore = [formValue, setFormValue] as StoreTuple<Partial<Value>>;
  form.providerValue = formProviderValue;
  return form;
}

const Form = <Value extends FormValue>(
  props: ParentProps<{ providerValue: FormProviderValue<Value> }>
): JSX.Element => {
  // eslint-disable-next-line solid/reactivity
  const [, setForm] = props.providerValue.store;

  onMount(() => {
    setForm(
      produce((form) => {
        form.errors = {};
      })
    );
  });

  return (
    <FormContext.Provider
      // eslint-disable-next-line solid/reactivity
      value={props.providerValue as unknown as FormProviderValue<FormValue>}
    >
      {props.children}
    </FormContext.Provider>
  );
};

/**
 * Gets a reference to the context of the parent form, this is mainly going
 * to be used inside of internal GrapeS components.
 *
 * The provider value that gets out of this function is precisely a class that has implemented methods
 * that help with validating, cleaninUp and managing all of the values of the form.
 */
export function useForm<K extends FormValue = FormValue>() {
  return useContext<FormProviderValue<FormValue> | undefined>(
    FormContext
  ) as unknown as FormProviderValue<K>;
}
