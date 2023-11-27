import { ParentProps, Show } from 'solid-js';

import { useField } from '../fields/FieldContext';
import { mergeClass } from '../../../utils';
import { Collapse } from '../../transitions';

/**
 * @description A integral GrapeS wrapper component that helps with handling
 * getting the errors from the Form and showing it inplace of the helper text.
 *
 * If there are no errors it just wraps the field's internals and
 * adds its helper text bellow.
 */
const FieldInternalWrapper = (props: ParentProps) => {
  const {
    hasErrors,
    errorsT: [errors],
    disabledS: [isDisabled],

    fieldProps
  } = useField()!;

  return (
    <>
      {props.children}

      <Collapse>
        <Show when={fieldProps.helperText || hasErrors()}>
          <div
            class={mergeClass(
              'pt-1.5 opacity-80 text-xs font-bold',
              hasErrors() && 'font-extrabold text-[var(--danger-bg)]'
            )}
          >
            <Show
              when={hasErrors() && !isDisabled()}
              fallback={fieldProps.helperText}
            >
              {errors![0]}
            </Show>
          </div>
        </Show>
      </Collapse>
    </>
  );
};

export default FieldInternalWrapper;
