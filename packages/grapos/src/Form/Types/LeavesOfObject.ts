type Join<K, P> = K extends string | number ?
  P extends string | number ?
  `${K}${'' extends P ? '' : '.'}${P}`
  : never : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

export type LeavesOfObject<A, D extends number = 5, T extends Required<A> = Required<A>> = [D] extends [never] ? never : T extends object ?
  T extends Date ? '' : { [K in keyof T]-?: Join<K, LeavesOfObject<T[K], Prev[D]>> }[keyof T] : '';

export type ArrLeavesOfObject<A, D extends number = 5, T extends Required<A> = Required<A>> = [D] extends [never] ? never : T extends object ?
  T extends Date ? [] : { [K in keyof T]-?: [K, ...ArrLeavesOfObject<T[K], Prev[D]>] }[keyof T] : [];

