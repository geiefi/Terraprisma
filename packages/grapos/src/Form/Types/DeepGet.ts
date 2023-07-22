import { Split } from './Split';

type RemoveFirst<T extends unknown[]> = T extends [] ? [] : 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends [infer _First, ...infer Rest] 
    ? Rest
    : T;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

type DeepGetPathArr<A, Path extends string[], Depth extends number = 6, T extends Required<A> = Required<A>> 
  = [Depth] extends [never] ? never : 
    Path[0] extends keyof T 
    ? T[Path[0]] extends object 
      ? T[Path[0]] extends Date ? T[Path[0]] : 
        DeepGetPathArr<T[Path[0]], RemoveFirst<Path>, Prev[Depth]>
      : T[Path[0]]
    : never;

export type DeepGet<T extends object, Path>
  = Path extends string ? DeepGetPathArr<T, Split<Path, '.'>> : never;