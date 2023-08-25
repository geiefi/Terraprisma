import { deeplyTrack } from './deeplyTrack';
import { splitTupleAccessor } from './splitTupleAccessor';
import { createComponentExtendingFromOther } from './createComponentExtendingFromOther';
import { mergeCallbacks } from './mergeCallbacks';
import { mergeClass } from './mergeClass';
import { canUseDocument } from './canUseDocument';

import type { Store } from './types/Store';

export {
  deeplyTrack,
  splitTupleAccessor,
  createComponentExtendingFromOther,
  mergeClass,
  mergeCallbacks,
  canUseDocument
};

export type { Store };
