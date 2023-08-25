import {
  JSX,
  ParentProps,
  createEffect,
  createRoot,
  onCleanup,
  onMount,
  useContext
} from 'solid-js';
import { SetStoreFunction, createStore, produce } from 'solid-js/store';

import { FormContext, FormProviderValue, FormStore } from './FormContext';

import { AgnosticValidator, FormValue } from './types';
import {
  ButtonChooser,
  Datepicker,
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Slider,
  TextArea,
  Toggler
} from './fields';
import { InputBaseValue, InputProps, InputType } from './fields/Input/Input';
import { SliderProps } from './fields/Slider/Slider';
import { SelectOptionProps, SelectProps } from './fields/Select/Select';
import {
  ButtonChooserOptionProps,
  ButtonChooserProps
} from './fields/ButtonChooser/ButtonChooser';
import {
  RadioGroupOptionProps,
  RadioGroupProps
} from './fields/RadioGroup/RadioGroup';
import { TextAreaProps } from './fields/TextArea/TextArea';
import { DatepickerProps } from './fields/Datepicker/Datepicker';
import { TogglerProps } from './fields/Toggler/Toggler';
import { CheckboxProps } from './fields/Checkbox/Checkbox';
import { FieldName } from './fields/utils/types/FieldProps';
import { FormFieldValue } from './types/FormFieldValue';

export interface FormProps<Value extends FormValue = FormValue>
  extends ParentProps {
  identification: string;
  formStore: [
    get: FormStore<Partial<Value>>,
    set: SetStoreFunction<FormStore<Partial<Value>>>
  ];
  agnosticValidators?: AgnosticValidator[];

  ref?: (val: FormProviderValue<Value>) => void;
}

export type Form<Value extends FormValue> = {
  (props: Omit<FormProps<Value>, 'identification' | 'formStore'>): JSX.Element;

  Input<
    Name extends FieldName<Value, InputBaseValue<Type>>,
    Type extends InputType = undefined
  >(
    props: InputProps<Value, Type, Name> &
      Omit<JSX.InputHTMLAttributes<HTMLInputElement>, keyof InputProps>
  ): JSX.Element;
  Slider<Name extends FieldName<Value, number>>(
    props: SliderProps<Value, Name> &
      Omit<JSX.InputHTMLAttributes<HTMLInputElement>, keyof SliderProps>
  ): JSX.Element;
  Select: {
    <Name extends FieldName<Value, FormFieldValue>>(
      props: SelectProps<Value, Name> &
        Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof SelectProps>
    ): JSX.Element;
    Option(props: SelectOptionProps): JSX.Element;
  };
  ButtonChooser: {
    <Name extends FieldName<Value, FormFieldValue>>(
      props: ButtonChooserProps<Value, Name> &
        Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof ButtonChooserProps>
    ): JSX.Element;
    Option(props: ButtonChooserOptionProps): JSX.Element;
  };
  RadioGroup: {
    <Name extends FieldName<Value, FormFieldValue>>(
      props: RadioGroupProps<Value, Name> &
        Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof RadioGroupProps>
    ): JSX.Element;
    Option(
      props: RadioGroupOptionProps & JSX.InputHTMLAttributes<HTMLInputElement>
    ): JSX.Element;
  };
  TextArea<Name extends FieldName<Value, string>>(
    props: TextAreaProps<Value, Name> &
      Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, keyof TextAreaProps>
  ): JSX.Element;
  Datepicker<Name extends FieldName<Value, Date>>(
    props: DatepickerProps<Value, Name> &
      Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof DatepickerProps>
  ): JSX.Element;
  Toggler<Name extends FieldName<Value, boolean>>(
    props: TogglerProps<Value, Name> &
      Omit<JSX.HTMLAttributes<HTMLInputElement>, keyof TogglerProps>
  ): JSX.Element;
  Checkbox<Name extends FieldName<Value, boolean>>(
    props: CheckboxProps<Value, Name> &
      Omit<JSX.HTMLAttributes<HTMLInputElement>, keyof CheckboxProps>
  ): JSX.Element;

  store: [
    get: FormStore<Partial<Value>>,
    set: SetStoreFunction<FormStore<Partial<Value>>>
  ];
};

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
  initialValue: Partial<Value> = {}
): Form<Value> {
  // eslint-disable-next-line solid/reactivity
  const formStore = createStore(new FormStore<Partial<Value>>(initialValue));

  const form = (
    props: Omit<FormProps<Value>, 'identification' | 'formStore'>
  ) => (
    <Form<Value>
      {...props}
      formStore={formStore}
      identification={identification}
    />
  );

  form.Input = Input<Value>;
  form.Slider = Slider<Value>;
  form.Select = Select<Value>;
  form.ButtonChooser = ButtonChooser<Value>;
  form.RadioGroup = RadioGroup<Value>;
  form.TextArea = TextArea<Value>;
  form.Datepicker = Datepicker<Value>;
  form.Toggler = Toggler<Value>;
  form.Checkbox = Checkbox<Value>;

  form.store = formStore;

  return form as Form<Value>;
}

const Form = <Value extends FormValue>(
  props: FormProps<Value>
): JSX.Element => {
  let disposeChildren: () => void;

  // eslint-disable-next-line solid/reactivity
  const [form, setForm] = props.formStore;

  onMount(() => {
    setForm(
      produce((form) => {
        form.errors = {};
      })
    );
  });

  const providerValue = new FormProviderValue<Value>(
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
      value={providerValue as unknown as FormProviderValue<FormValue>}
    >
      {createRoot((rootDispose) => {
        disposeChildren = rootDispose;

        return props.children;
      })}
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
