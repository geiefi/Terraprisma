import { SetStoreFunction } from 'solid-js/store';

export type StoreTuple<T> = [get: T, set: SetStoreFunction<T>];
