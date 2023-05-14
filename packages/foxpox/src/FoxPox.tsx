import { Accessor, Component, createContext, createEffect, createMemo, createSignal, ParentProps, Signal, useContext } from "solid-js";

import "./FoxPox.scss";

import { Theme } from "./Themes/Theme";
import { FoxPoxLightTheme } from "./Themes/FoxPoxLight";

export type FoxPoxProviderValue = {
  themes: Theme[];
  currentTheme: Accessor<Theme>;
  currentThemeIdSignal: Signal<string>;
};

const FoxPoxContext = createContext<FoxPoxProviderValue>();

/**
 * A component that creates the `<FoxPoxContext>` with the themes defined and creates
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

  createEffect(() => {
    document.body.style.backgroundColor = currentTheme().grays[0].toRGBA();
  });

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
        || currentTheme().primary.withAlpha(0.32)).toRGBA(),

      '--secondary': currentTheme().secondary.toRGBA(),
      '--lightened-secondary': (currentTheme().lightnedSecondary 
        || currentTheme().secondary.withAlpha(0.32)).toRGBA(),

      '--tertiary': currentTheme().tertiary.toRGBA(),
      '--lightened-tertiary': (currentTheme().lightnedTertiary 
        || currentTheme().tertiary.withAlpha(0.32)).toRGBA(),

      '--error': currentTheme().error.toRGBA(),

      '--lightened-primary-2': (currentTheme().lightnedPrimary2 
        || currentTheme().primary.withAlpha(0.20)).toRGBA(),
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
