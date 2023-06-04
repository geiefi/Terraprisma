import { createEffect, createMemo, JSX, on, onCleanup, onMount, ParentProps, useContext } from 'solid-js';
import { createStore, produce, SetStoreFunction } from 'solid-js/store';

import {
  AgnosticValidator,
  FormContext,
  FormError,
  FormProviderValue,
  FormStore,
  FormValue
} from './FormContext';

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

  ref?: (val: FormProviderValue<FormValue>) => void,
}>): JSX.Element => {
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
    props.indentification
  );

  onMount(() => {
    if (typeof props.ref !== 'undefined') {
      createEffect(() => {
        providerValue.track();
        props.ref!(providerValue);
      });
    }
  });

  return <FormContext.Provider
    value={providerValue}
  >
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

  ref?: (val: FormProviderValue<FormValue>) => void,
}>) => {
  const form = useForm();

  onMount(() => {
    if (typeof form === 'undefined') {
      throw new FormError(
        `Error with the <Form.Inner> called "${props.identification}": ` +
        'Cannot have a <Form.Inner> component if it is not inside a <Form> component!'
      );
    }
  });

  const [innerFormStore, setInnerFormStore] = createStore<FormStore<any>>(
    // eslint-disable-next-line solid/reactivity
    new FormStore(form.valueFor(props.name) as any || {})
  );
  const innerForm = new FormProviderValue(
    [innerFormStore, setInnerFormStore],
    // eslint-disable-next-line solid/reactivity
    props.agnosticValidators || [],
    // eslint-disable-next-line solid/reactivity
    props.identification,
  );

  const allErrors = createMemo(
    () => Object.values(innerFormStore.errors).flat().filter(Boolean) as string[]
  );

  onMount(() => {
    if (typeof form.valueFor(props.name) !== 'undefined') {
      form.cleanUp(props.name);
    }

    form.init(props.name, [
      // eslint-disable-next-line solid/reactivity
      () => innerForm.validateAll() ? [] : allErrors()
    ], innerFormStore.values as any);

    if (typeof props.ref !== 'undefined') {
      createEffect(() => {
        innerForm.track();
        props.ref!(innerForm);
      });
    }
  });

  onCleanup(() => {
    form.cleanUp(props.name);
  });

  createEffect(() => {
    const newValues = form.valueFor(props.name);
    form.update(props.name, newValues);
    form.store[1](produce(form => {
      form.errors[props.name] = allErrors();
    }));
  });

  createEffect(on(
    () => form.valueFor(props.name),
    () => {
      const newValuesFromParent = form.valueFor(props.name);

      setInnerFormStore(produce(innerFormStore => {
        innerFormStore.values = newValuesFromParent;
      }));
    }
  ));

  return <FormContext.Provider
    value={innerForm}
  >
    {props.children}
  </FormContext.Provider>;
};

Form.Inner = innerForm;

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
