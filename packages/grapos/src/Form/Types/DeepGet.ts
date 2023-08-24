export type DeepGet<TValue, TPath> = TPath extends keyof TValue
  ? TValue[TPath]
  : TPath extends `${infer FirstKey}.${infer Rest}`
  ? FirstKey extends keyof TValue
    ? DeepGet<TValue[FirstKey], Rest>
    : never
  : never;
