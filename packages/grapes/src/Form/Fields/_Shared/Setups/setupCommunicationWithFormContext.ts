import { onCleanup, onMount } from 'solid-js';
import { produce } from 'solid-js/store';

import { useForm } from '../../../Form';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';
import { FormProviderValue } from '../../../FormContext';

import { FieldProps } from '../FieldProps';

export function setupCommunicationWithFormContext<
  T extends FieldProps,
  K extends FormValue = FormValue
>(props: T, initialValue: FormFieldValue = ''): FormProviderValue<K> | undefined {
  let form: FormProviderValue<K> | undefined = useForm<K>();
  if (props.manuallyControlled) {
    form = undefined;
  }

  if (form) {
    onMount(() => {
      if (typeof form!.valueFor(props.name) !== 'undefined') {
        form!.store[1](produce(form => {
          form.errors[props.name as keyof K] = [];
        }));
      }

      form!.init(
        props.name,
        props.validators || [],
        (form!.valueFor(props.name) || initialValue) as K[keyof K]
      );
    });

    onCleanup(() => {
      form!.cleanUp(props.name);
    });

    return form;
  } else {
    return undefined;
  }
}

