import { Accessor, createMemo, onCleanup, onMount } from "solid-js";

import { useForm } from "../../Form";
import { FieldValidator, FormProviderValue, FormValue } from "../../FormContext";

/**
  * The field props that are required for all of the fields used in conjunction with the `<Form />`
  * component
  */
export interface FieldProps {
  name: string;
  validators?: FieldValidator[];
} 

export function setupCommunicationWithFormContext<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T): { value: Accessor<K[keyof K] | undefined>, form: FormProviderValue<K> } {
  const form = useForm<K>();

  const value = createMemo(() => form.valueFor(props.name) || '' as any);

  onMount(() => {
    if (typeof form.valueFor(props.name) !== 'undefined') {
      form.cleanUp(props.name);
    }

    form.init(props.name, props.validators || [], value() || '' as any);
  });

  onCleanup(() => {
    form.cleanUp(props.name);
  });

  return { form, value };
}
