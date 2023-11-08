import { Component, ComponentProps, Show } from 'solid-js';

import { mergeClass } from '@terraprisma/utils';

import { useField } from '../fields/FieldContext';

import { Collapse } from '@terraprisma/transitions';

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
      class={mergeClass('w-full h-full inline-block px-2', divProps.class)}
    >
      {divProps.children}

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
    </div>
  );
};

export default FieldInternalWrapper;
