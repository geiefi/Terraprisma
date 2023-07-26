import { onCleanup, onMount } from 'solid-js';
import { produce } from 'solid-js/store';

import { useForm } from '../../../Form';

import { FormFieldValue } from '../../../Types/FormFieldValue';
import { FormValue } from '../../../Types/FormValue';
import { FormProviderValue } from '../../../FormContext';

import { FieldProps } from '../Types/FieldProps';

export function setupCommunicationWithFormContext<
  Props extends FieldProps<OwnerFormValue, BaseValueType>,
  BaseValueType extends FormFieldValue,
  OwnerFormValue extends FormValue = FormValue
>(props: Props, initialValue: BaseValueType = '' as any): FormProviderValue<OwnerFormValue> | undefined {
  let form: FormProviderValue<OwnerFormValue> | undefined = useForm<OwnerFormValue>();
  if (props.manuallyControlled) {
    form = undefined;
  }

  if (form) {
    onMount(() => {
      if (typeof form!.valueFor(props.name) !== 'undefined') {
        form!.store[1](produce(form => {
          form.errors[props.name] = [];
        }));
      }

      form!.init(
        props.name,
        props.validators || [],
        (form!.valueFor(props.name) || initialValue as any)
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