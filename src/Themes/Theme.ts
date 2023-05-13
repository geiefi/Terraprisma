import tinycolor2 from "tinycolor2";

/**
 * A class that uses the `tinycolor2` library to parse and 
 * deal with colors. Contains a **internal** property with
 * the `tinycolor2.Instance` interface.
 */
export class Color {
  internal: tinycolor2.Instance;

  constructor(input: tinycolor2.ColorInput) {
    this.internal = tinycolor2(input);
  }

  setAlpha(newAlpha: number): Color {
    this.internal.setAlpha(newAlpha);
    return this;
  }

  toHex(): string {
    return `#${this.internal.toHex()}`;
  }

  toRGBA(): string {
    const rgb = this.internal.toRgb();
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  }
}

export type Theme = {
  id: string;
  /**
   * The gray scale that should be followed by the website,
   * the default is increasingly dark.
   */
  grays: {
    /**
     * This is the first gray color, it is automatically
     * used to set the background-color of the body. 
     *
     * This color is most useful for dark themes.
     */
    0: Color;
    1: Color;
    2: Color;
    3: Color;
    4: Color;
    5: Color;
  }
  primary: Color;
  /**
   * Generally just a 0.32 alpha version of the already defined primary color,
   * which is calculated automatically, but can be defined to be something else.
   */
  lightnedPrimary?: Color;
  /**
   * Generally just a 0.20 alpha version of the already defined primary color,
   * which is calculated automatically, but can be defined to be something else.
   */
  lightnedPrimary2?: Color;
  secondary: Color;
  /**
   * Generally just a 0.32 alpha version of the already defined secondary color,
   * which is calculated automatically, but can be defined to be something else.
   */
  lightnedSecondary?: Color;
  tertiary: Color;
  /**
   * Generally just a 0.32 alpha version of the already defined tertiary color,
   * which is calculated automatically, but can be defined to be something else.
   */
  lightnedTertiary?: Color;

  error: Color;
};
