import {
  Component,
  ComponentProps,
  createMemo,
  Show,
} from 'solid-js';
import { mergeClass } from '../../../../_Shared/Utils';

import './FieldInternalWrapper.scss';
import { useField } from '../FieldHelpers/FieldContext';

/**
 * @description A integral GrapeS wrapper component that helps with handling
 * getting the errors from the Form and showing it inplace of the helper text.
 *
 * If there are no errors it just wraps the field's internals and
 * adds its helper text bellow.
 */
const FieldInternalWrapper: Component<ComponentProps<'div'>> = (divProps) => {
  const {
    hasErrors,
    errorsT: [errors],
    disabledS: [isDisabled],

    fieldProps,
  } = useField()!;

  const shouldRenderHelperText = createMemo(
    () =>
      (typeof fieldProps.validators !== 'undefined' &&
        fieldProps.validators.length !== 0) ||
      typeof fieldProps.helperText !== 'undefined'
  );

  return (
    <div
      {...divProps}
      class={mergeClass('field', divProps.class)}
      classList={{
        error: hasErrors(),
        ...divProps.classList,
      }}
    >
      {divProps.children}

      <Show when={shouldRenderHelperText()}>
        <div class="helper-text">
          <Show
            when={hasErrors() && !isDisabled()}
            fallback={fieldProps.helperText}
          >
            {errors![0]}
          </Show>
          &nbsp;
        </div>
      </Show>
    </div>
  );
};

export default FieldInternalWrapper;
