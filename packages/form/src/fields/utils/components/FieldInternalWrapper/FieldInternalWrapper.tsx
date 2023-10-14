import { Component, ComponentProps, createMemo, Show } from 'solid-js';

import { mergeClass } from '@terraprisma/utils';

import { useField } from '../../fields/FieldContext';

import './FieldInternalWrapper.scss';

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

    fieldProps
  } = useField()!;

  return (
    <div
      {...divProps}
      class={mergeClass('field', divProps.class)}
      classList={{
        error: hasErrors(),
        ...divProps.classList
      }}
    >
      {divProps.children}

      <div class="helper-text">
        <Show
          when={hasErrors() && !isDisabled()}
          fallback={fieldProps.helperText}
        >
          {errors![0]}
        </Show>
        &nbsp;
      </div>
    </div>
  );
};

export default FieldInternalWrapper;
