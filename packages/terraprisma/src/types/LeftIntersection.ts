export type LeftIntersection<
  TLeft extends Record<string, any>,
  TRight extends Record<string, any>
> = TLeft & Omit<TRight, keyof TLeft>;
