import { JSX, ParentProps, onMount, useContext } from 'solid-js';
import {
  SetStoreFunction,
  createStore,
  produce
} from 'solid-js/store';

import { Form, FormStore } from './FormContext';

import { AgnosticValidator, FormValue } from './types';

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
  initialValueOrStoreTuple:
    | Partial<Value>
    | [get: Partial<Value>, set: SetStoreFunction<Partial<Value>>] = {},
  agnosticValidators: AgnosticValidator[] = []
): Form<Value> {
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

  const form = new Form<Value>(
    formStore,
    [formValue, setFormValue],
    agnosticValidators,
  );

  return form;
}

