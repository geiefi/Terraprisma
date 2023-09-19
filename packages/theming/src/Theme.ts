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

type BgColorsFor<Colors extends string> =
  Colors extends `${string}-${infer Clr}-bg`
    ? Clr
    : Colors extends `${infer Clr}-bg`
    ? Clr
    : never;

export type AccentColors<T extends Theme<Record<string, Accent> | undefined>> =
  | (T extends Theme<infer Accents extends Record<string, any>>
      ? keyof Accents
      : 'accent')
  | 'success'
  | 'warning'
  | 'danger';

export type BgColors<Obj extends Record<string, any> = Theme> =
  | BgColorsFor<AllPossibleColors<Obj>>
  | 'accent';

export type Accent = BgFgPair & { hover: Color };

export type Theme<
  Accents extends Record<string, Accent> | undefined =
    | Record<string, Accent>
    | undefined
> = {
  id: string;

  bgBackdrop: Color;
  normal: BgFgPair;

  floating: BgFgPair & { border: Color };
  deeper: BgFgPair;

  muted: BgFgPair;

  /**
   * @description For texts that are within the <Marked/> component
   */
  marked: BgFgPair;

  success: Accent;
  warning: Accent;
  danger: Accent;
} & (undefined extends Accents
  ? {
      /**
       * @description The accent color for the whole website, there is also an `accents` option that
       * allows for many accents.
       */
      accent: Accent;
    }
  : {
      /**
       * @description A list of accent colors, the first accent color is going to be the primary one.
       */
      accents: Accents;
    });

export function c<
  Bg extends string,
  Fg extends string,
  Additional extends Record<string, Color> = {}
>(
  bg: Bg,
  fg: Fg,
  additional: Additional = {} as Additional
): { bg: Color<Bg>; fg: Color<Fg> } & Additional {
  return {
    bg: new Color(bg),
    fg: new Color(fg),
    ...additional
  };
}
