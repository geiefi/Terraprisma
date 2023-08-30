import { LeavesOfObject, NonObject } from '@grapos/utils';
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

export type Theme<Accents extends Record<string, BgFgPair> | never = never> = {
  id: string;

  bgBackdrop: Color;
  normal: BgFgPair;

  floating: BgFgPair & { border: Color };

  /**
   * @description For texts that are within the <Marked/> component
   */
  marked: BgFgPair;

  success: Color;
  warning: Color;
  danger: Color;
} & (
  | {
      /**
       * @description The accent color for the whole website, there is also an `accents` option that
       * allows for many accents.
       */
      accent: BgFgPair;
    }
  | {
      mainAccent: keyof Accents;
      /**
       * @description A list of accent colors, the first accent color is going to be the primary one.
       */
      accents: Accents;
    }
);
