import tinycolor2 from 'tinycolor2';

/**
 * A class that uses the `tinycolor2` library to parse and
 * deal with colors. Contains a **internal** property with
 * the `tinycolor2.Instance` interface.
 */
export class Color<Input extends tinycolor2.ColorInput = string> {
  internal: tinycolor2.Instance;

  constructor(input: Input) {
    this.internal = tinycolor2(input);
  }

  withAlpha(newAlpha: number): Color<Input> {
    const clone = new Color(this.internal.clone());
    clone.internal.setAlpha(newAlpha);
    return clone;
  }

  toHex(): string {
    return `#${this.internal.toHex()}`;
  }

  toRGBA(): string {
    const rgb = this.internal.toRgb();
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  }
}

export type BgFgPair = { bg: Color; fg: Color };

type Kebab<
  T extends string,
  A extends string = ''
> = T extends `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
  : A;

type AllPossibleColors<Obj extends Record<string, any>> = {
  [K in keyof Obj]: RestPossibleColors<Kebab<K & string>, Obj[K]>;
}[keyof Obj];

type RestPossibleColors<K extends string, Value> = Value extends Color
  ? `${K}`
  : Value extends Record<string, any>
  ? `${K}-${AllPossibleColors<Value>}`
  : never;

export type PossibleColors<
  Obj extends Record<string, any> = Theme,
  Colors extends AllPossibleColors<Obj> = AllPossibleColors<Obj>
> =
  | (Colors extends `${string}-${infer Clr}-bg`
      ? Clr
      : Colors extends `${infer Clr}-bg`
      ? Clr
      : never)
  | 'accent';

export type Theme<
  Accents extends Record<string, BgFgPair> | undefined = undefined
> = {
  id: string;

  bgBackdrop: Color;
  normal: BgFgPair;

  floating: BgFgPair & { border: Color };

  /**
   * @description For texts that are within the <Marked/> component
   */
  marked: BgFgPair;

  success: BgFgPair;
  warning: BgFgPair;
  danger: BgFgPair;
} & (Accents extends undefined
  ? {
      /**
       * @description The accent color for the whole website, there is also an `accents` option that
       * allows for many accents.
       */
      accent: BgFgPair;
    }
  : {
      mainAccent: keyof Accents;
      /**
       * @description A list of accent colors, the first accent color is going to be the primary one.
       */
      accents: Accents;
    });
