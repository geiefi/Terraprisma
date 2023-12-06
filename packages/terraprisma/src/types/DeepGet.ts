export type DeepGet<
  _TValue,
  TPath,
  TValue extends Required<_TValue> = Required<_TValue>
> = TPath extends keyof TValue
  ? TValue[TPath]
  : TPath extends `${infer FirstKey}.${infer Rest}`
    ? FirstKey extends keyof TValue
      ? DeepGet<TValue[FirstKey], Rest>
      : never
    : never;
