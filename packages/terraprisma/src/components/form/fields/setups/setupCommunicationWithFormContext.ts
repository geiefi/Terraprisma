import { createEffect, onCleanup, onMount } from 'solid-js';
import { produce } from 'solid-js/store';
import { useForm } from '../../Form';
import { FormProviderValue } from '../../FormContext';
import { FieldName, FieldProps, FormFieldValue, FormValue } from '../../types';
import { isForcingManualControl } from '../../ForceManualControl';

export function setupCommunicationWithFormContext<
  Name extends FieldName<OwnerFormValue, BaseValueType>,
  Props extends FieldProps<OwnerFormValue, BaseValueType, Name>,
  BaseValueType extends FormFieldValue,
  OwnerFormValue extends FormValue
>(
  props: Props,
  initialValue: Props['value'] & BaseValueType = '' as any
): FormProviderValue<OwnerFormValue> | undefined {
  let form: FormProviderValue<OwnerFormValue> | undefined =
    useForm<OwnerFormValue>();
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
        form!.valueFor(props.name) || (initialValue as any)
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
