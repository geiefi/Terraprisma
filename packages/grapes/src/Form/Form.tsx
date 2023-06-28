import { JSX, ParentProps, createEffect, createMemo, createRoot, on, onCleanup, onMount, useContext } from 'solid-js';
import { SetStoreFunction, createStore, produce } from 'solid-js/store';

import {
  FormContext,
  FormError,
  FormProviderValue,
  FormStore,
} from './FormContext';

import { AgnosticValidator } from './Types/AgnosticValidator';
import { FormValue } from './Types/FormValue';
import { ButtonChooser, Datepicker, Checkbox, Input, RadioGroup, Select, Slider, TextArea, Toggler } from './Fields';
import { Key } from '../_Shared/Types/Key';

export interface FormProps extends ParentProps {
  indentification: string,
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
export function createForm<Value extends FormValue>(
  indentification: string, 
  initialValue: Partial<Value> = {}
) {
  // eslint-disable-next-line solid/reactivity
  const formStore = createStore(new FormStore<Partial<Value>>(initialValue));

  const form = (props: Omit<FormProps, 'identification' | 'formStore'>) => (
    <Form 
      {...props}
      formStore={formStore}
      indentification={indentification} 
    />
  );

  form.Input = Input<keyof Value>;
  form.Slider = Slider<keyof Value>;
  form.Select = Select<keyof Value>;
  form.ButtonChooser = ButtonChooser<keyof Value>;
  form.RadioGroup = RadioGroup<keyof Value>;
  form.TextArea = TextArea<keyof Value>;
  form.Datepicker = Datepicker<keyof Value>;
  form.Toggler = Toggler<keyof Value>;
  form.Checkbox = Checkbox<keyof Value>;

  form.Inner = Form.Inner<keyof Value>;

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
    props.indentification
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
 * @description Does basically the same as the <Form> component,
 * but is made to be used inside of a <Form> and it acts as a proxy between the fields
 * and an object field inside the values of the <Form>.
 */
const innerForm = <FormFieldKey extends Key = string>(props: ParentProps<{
  identification: string,
  /**
   * This name is **NOT** the identification of the component, it rather is the field name inside
   * of the values of the parent <Form>
   */
  name: FormFieldKey,
  agnosticValidators?: AgnosticValidator[],

  ref?: (val: FormProviderValue<FormValue>) => void,
}>) => {
  let disposeChildren: () => void;

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
    new FormStore(form.valueFor(props.name.toString()) as any || {})
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
    if (typeof form.valueFor(props.name.toString()) !== 'undefined') {
      form.cleanUp(props.name.toString());
    }

    form.init(props.name.toString(), [
      // eslint-disable-next-line solid/reactivity
      () => innerForm.validateAll() ? [] : allErrors()
    ], innerFormStore.values as any);

    innerForm.isCleaningUp = false;

    if (typeof props.ref !== 'undefined') {
      createEffect(() => {
        innerForm.track();
        props.ref!(innerForm);
      });
    }
  });

  onCleanup(() => {
    form.cleanUp(props.name.toString());

    innerForm.isCleaningUp = true;

    disposeChildren && disposeChildren();
  });

  createEffect(() => {
    const newValues = form.valueFor(props.name.toString());
    form.update(props.name.toString(), newValues);
    form.store[1](produce(form => {
      form.errors[props.name.toString()] = allErrors();
    }));
  });

  createEffect(on(
    () => form.valueFor(props.name.toString()),
    () => {
      const newValuesFromParent = form.valueFor(props.name.toString());

      setInnerFormStore(produce(innerFormStore => {
        innerFormStore.values = newValuesFromParent;
      }));
    }
  ));

  return <FormContext.Provider
    value={innerForm}
  >
    {createRoot(rootDispose => {
      disposeChildren = rootDispose;
      return props.children;
    })}
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
