import { SetStoreFunction, Store as StoreGetter } from 'solid-js/store';

export type Store<T> = [get: StoreGetter<T>, set: SetStoreFunction<T>];
