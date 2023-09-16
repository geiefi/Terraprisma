import { deeplyTrack } from './deeplyTrack';
import { splitTupleAccessor } from './splitTupleAccessor';
import { mergeCallbacks } from './mergeCallbacks';
import { mergeClass } from './mergeClass';
import { canUseDocument } from './canUseDocument';

export * from './factories';
export * from './types';

import type { Store, Theme } from './types';

declare global {
  function dbg<T = any>(el: T, context?: string): T;
}

const _global = typeof window !== 'undefined' ? window : global;
/**
 * @description `console.log`'s the `el` then returns it
 *
 * This function is inspired in Rust's `dbg!` macro.
 */
_global.dbg = function <T = any>(el: T, context?: string): T {
  if (context) {
    console.groupCollapsed(`${context}:`, el);
  } else {
    console.groupCollapsed(el);
  }
  console.trace('for this dbg() call');
  console.groupEnd();
  return el;
};

declare global {
  interface Register {
    // themes: typeof myThemes;
  }
}

declare global {
  export type Themes = Register extends {
    themes: infer InferredThemes extends Theme[];
  }
    ? InferredThemes
    : Theme[];
}

export {
  deeplyTrack,
  splitTupleAccessor,
  mergeClass,
  mergeCallbacks,
  canUseDocument
};

export type { Store };
