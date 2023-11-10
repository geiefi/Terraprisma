import { deeplyTrack } from './deeplyTrack';
import { splitTupleAccessor } from './splitTupleAccessor';
import { mergeCallbacks } from './mergeCallbacks';
import { mergeClass } from './mergeClass';
import { canUseDocument } from './canUseDocument';
import { getAbsoluteBoundingRect } from './getAbsoluteBoundingRect';

export * from './factories';
export * from './types';

import type { Store } from './types';

export {
  deeplyTrack,
  splitTupleAccessor,
  mergeClass,
  mergeCallbacks,
  canUseDocument,
  getAbsoluteBoundingRect
};

export type { Store };
