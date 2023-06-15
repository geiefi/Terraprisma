import { SetStoreFunction } from 'solid-js/store';

export type Store<T> = [get: T, set: SetStoreFunction<T>];

