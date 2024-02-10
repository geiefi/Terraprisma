import { JSX, ParentProps, onMount, useContext } from 'solid-js';
import {
  SetStoreFunction,
  StoreSetter,
  createStore,
  produce,
  unwrap
} from 'solid-js/store';

import { FormContext, FormProviderValue, FormStore } from './FormContext';

import { AgnosticValidator, FieldName, FormValue } from './types';
import {
  Datepicker,
  Checkbox,
  RadioGroup,
  Select,
  Slider,
  TextArea,
  Toggler,
  Input
} from './fields';
import { InputBaseValue, InputProps, InputType } from './fields/Input/Input';
import { SliderProps } from './fields/Slider/Slider';
import { SelectOptionProps, SelectProps } from './fields/Select';
import { RadioGroupOptionProps, RadioGroupProps } from './fields/RadioGroup';
import { TextAreaProps } from './fields/TextArea/TextArea';
import { DatepickerProps } from './fields/Datepicker/Datepicker';
import { TogglerProps } from './fields/Toggler';
import { CheckboxProps } from './fields/Checkbox';
import { FormFieldValue } from './types/FormFieldValue';
import { StoreTuple } from '../../types';

export interface Form<Value extends FormValue> {
  (props: ParentProps): JSX.Element;

  Input: <
    Name extends FieldName<Value, InputBaseValue<Type>>,
    Type extends InputType = undefined
  >(
    props: InputProps<Type, Value, Name>
  ) => JSX.Element;
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

  store: [get: FormStore, set: SetStoreFunction<FormStore>];

  valuesStore: [get: Partial<Value>, set: SetStoreFunction<Partial<Value>>];

  providerValue: FormProviderValue<Value>;
}

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

  const formProviderValue = new FormProviderValue<Value>(
    formStore,
    [formValue, setFormValue],
    agnosticValidators,
    identification
  );

  const form = (props: ParentProps) => (
    <Form<Value> providerValue={formProviderValue}>{props.children}</Form>
  );

  form.Input = Input;
  form.Slider = Slider;
  form.Select = Select;
  form.RadioGroup = RadioGroup;
  form.TextArea = TextArea;
  form.Datepicker = Datepicker;
  form.Toggler = Toggler;
  form.Checkbox = Checkbox;

  form.store = formStore;
  form.valuesStore = [formValue, setFormValue] as StoreTuple<Partial<Value>>;
  form.providerValue = formProviderValue;

  return form as Form<Value>;
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
