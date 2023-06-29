import { JSX, ParentProps, createEffect, createRoot, onCleanup, onMount, useContext } from 'solid-js';
import { SetStoreFunction, createStore, produce } from 'solid-js/store';

import {
  FormContext,
  FormProviderValue,
  FormStore,
} from './FormContext';

import { AgnosticValidator } from './Types/AgnosticValidator';
import { FormValue } from './Types/FormValue';
import { ButtonChooser, Datepicker, Checkbox, Input, RadioGroup, Select, Slider, TextArea, Toggler } from './Fields';
import { LeavesOfObject } from './Types/LeavesOfObject';

export interface FormProps extends ParentProps {
  identification: string,
  formStore: [get: FormStore<any>, set: SetStoreFunction<FormStore<any>>],
  agnosticValidators?: AgnosticValidator[],

  ref?: (val: FormProviderValue<FormValue>) => void,
}

/**
 * @description This is a Form pattern of usage that makes it possible to have typesafe fields
 * based on their field names. 
 * This creates Solid's component functions procedurally with the type parameter of the names.
 * This also makes it simpler to use in the end since you don't to create the store for the form's state.
 */
export function createForm<Value extends FormValue, Leaves extends LeavesOfObject<Value> = LeavesOfObject<Value>>(
  indentification: string, 
  initialValue: Partial<Value> = {}
) {
  // eslint-disable-next-line solid/reactivity
  const formStore = createStore(new FormStore<Partial<Value>>(initialValue));

  const form = (props: Omit<FormProps, 'identification' | 'formStore'>) => (
    <Form 
      {...props}
      formStore={formStore}
      identification={indentification} 
    />
  );

  form.Input = Input<Leaves>;
  form.Slider = Slider<Leaves>;
  form.Select = Select<Leaves>;
  form.ButtonChooser = ButtonChooser<Leaves>;
  form.RadioGroup = RadioGroup<Leaves>;
  form.TextArea = TextArea<Leaves>;
  form.Datepicker = Datepicker<Leaves>;
  form.Toggler = Toggler<Leaves>;
  form.Checkbox = Checkbox<Leaves>;

  form.store = formStore;

  return form;
}

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
const Form = (props: FormProps): JSX.Element => {
  let disposeChildren: () => void;

  // eslint-disable-next-line solid/reactivity
  const [form, setForm] = props.formStore;

  onMount(() => {
    setForm(produce(form => {
      form.errors = {};
    }));
  });

  const providerValue = new FormProviderValue(
    [form, setForm],
    // eslint-disable-next-line solid/reactivity
    props.agnosticValidators || [],
    // eslint-disable-next-line solid/reactivity
    props.identification
  );

  onCleanup(() => {
    providerValue.isCleaningUp = true;

    disposeChildren && disposeChildren(); // we need to manually dispose here so that the clean up of the fields
                          // persists their values
  });

  onMount(() => {
    providerValue.isCleaningUp = false;

    if (typeof props.ref !== 'undefined') {
      createEffect(() => {
        providerValue.track();
        props.ref!(providerValue);
      });
    }
  });

  return (
    <FormContext.Provider
      value={providerValue}
    >
      {createRoot(rootDispose => {
        disposeChildren = rootDispose;

        return props.children;
      })}
    </FormContext.Provider>
  );
}

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

export default Form;
