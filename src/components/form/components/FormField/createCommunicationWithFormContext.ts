import { createEffect, onMount } from 'solid-js';
import { produce } from 'solid-js/store';
import { useForm } from '../../Form';
import { FormProviderValue } from '../../FormContext';
import { FieldProps, FormFieldValue, FormValue } from '../../types';
import { isForcingManualControl } from '../../ForceManualControl';

export function createCommunicationWithFormContext<
  BaseValueType extends FormFieldValue,
>(
  props: FieldProps<FormValue, BaseValueType>,
  initialValue: BaseValueType = '' as any
): FormProviderValue<FormValue> | undefined {
  let form: FormProviderValue<FormValue> | undefined =
    useForm<FormValue>();
  if (props.manuallyControlled ?? isForcingManualControl()) {
    form = undefined;
  }

  if (form) {
    onMount(() => {
      if (typeof form!.valueFor(props.name) !== 'undefined') {
        form!.store[1](
          produce((form) => {
            form.errors[props.name] = [];
          })
        );
      }

      form!.init(
        props.name,
        (props.validators || []) as any,
        form!.valueFor(props.name) ?? (initialValue as any)
      );
    });

    createEffect(() => {
      form!.store[1](
        produce((form) => {
          form.validators[props.name] = props.validators;
        })
      );
    });

    return form;
  } else {
    return undefined;
  }
}
