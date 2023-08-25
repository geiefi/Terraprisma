/**
 * @description Accesses all the internal values of an item to make sure it is being tracked by
 * createMemo, createEffect, etc.
 * Very useful for stores.
 */
export function deeplyTrack(item: any, ignore: string[] = []): void {
  if (typeof item === 'object') {
    for (const key of Object.keys(item)) {
      if (ignore.includes(key)) {
        deeplyTrack(item[key]);
      }
    }
  } else {
    item;
  }
}
