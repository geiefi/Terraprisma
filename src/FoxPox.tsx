import { Accessor, Component, createContext, createMemo, createSignal, ParentProps, Signal, useContext } from "solid-js";

import "./FoxPox.scss";

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

export const FoxPoxLightTheme: Theme = {
  id: 'light',

  grays: {
    0: new Color('#ffffff'),
    1: new Color('#dcdcdc').setAlpha(0.77),
    2: new Color('#D8D5D5'),
    3: new Color('#a0a0a0'),
    4: new Color('#808080'),
    5: new Color('#534848'),
  },

  primary: new Color('#bd462b'),
  secondary: new Color('#1cb88e'),
  tertiary: new Color('#9b66d9'),

  error: new Color('#AB4B4B'),
};

export type FoxPoxProviderValue = {
  themes: Theme[];
  currentTheme: Accessor<Theme>;
  currentThemeIdSignal: Signal<string>;
};

const FoxPoxContext = createContext<FoxPoxProviderValue>();

/**
 * A component that creates the <FoxPoxContext> with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, FoxPox's default themes are used.
 *
 * If there is no default theme, the first custom theme is used or `FoxPoxLightTheme` is used.
 */
export const FoxPox: Component<ParentProps<{
  themes?: Theme[];
  defaultThemeId?: string;
}>> = (props) => {
  const hasCustomThemes = createMemo(() => props.themes && props.themes.length >= 1);

  const currentThemeIdSignal = createSignal<string>(props.defaultThemeId || (
    hasCustomThemes()
      ? props.themes![0].id
      : FoxPoxLightTheme.id
  ));

  const themes = hasCustomThemes()
    ? props.themes!
    : [
      FoxPoxLightTheme
    ];

  const currentTheme = createMemo(() => themes.find(t => t.id === currentThemeIdSignal[0]())!);

  return <FoxPoxContext.Provider value={{
    themes,
    currentTheme,
    currentThemeIdSignal
  }}>
    <div id="fox-pox-app" style={{
      '--gray-0': currentTheme().grays[0].toRGBA(),
      '--gray-1': currentTheme().grays[1].toRGBA(),
      '--gray-2': currentTheme().grays[2].toRGBA(),
      '--gray-3': currentTheme().grays[3].toRGBA(),
      '--gray-4': currentTheme().grays[4].toRGBA(),
      '--gray-5': currentTheme().grays[5].toRGBA(),

      '--primary': currentTheme().primary.toRGBA(),
      '--lightened-primary': (currentTheme().lightnedPrimary 
        || currentTheme().primary.setAlpha(0.32)).toRGBA(),

      '--secondary': currentTheme().secondary.toRGBA(),
      '--lightened-secondary': (currentTheme().lightnedSecondary 
        || currentTheme().secondary.setAlpha(0.32)).toRGBA(),

      '--tertiary': currentTheme().tertiary.toRGBA(),
      '--lightened-tertiary': (currentTheme().lightnedTertiary 
        || currentTheme().tertiary.setAlpha(0.32)).toRGBA(),

      '--error': currentTheme().error.toRGBA(),

      '--lightened-primary-2': (currentTheme().lightnedPrimary2 
        || currentTheme().primary.setAlpha(0.20)).toRGBA(),
    }}>
      {props.children}
    </div>
  </FoxPoxContext.Provider>;
};

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes. 
 *
 * This is supposed to be used inside a `<FoxPox>` component since it is the one whom
 * initializes the global FoxPox context.
 */
export function useTheme(): FoxPoxProviderValue | undefined {
  return useContext<FoxPoxProviderValue | undefined>(FoxPoxContext);
}
