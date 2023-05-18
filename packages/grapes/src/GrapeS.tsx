import { 
  Accessor, 
  Component, 
  createContext, 
  createEffect, 
  createMemo, 
  createSignal, 
  ParentProps, 
  Signal, 
  useContext 
} from "solid-js";

import "./GrapeS.scss";

import { Theme, GrapeSDarkTheme, GrapeSLightTheme } from "./Themes";

export type GrapeSThemesProviderValue = {
  themes: Theme[];
  currentTheme: Accessor<Theme>;
  currentThemeIdSignal: Signal<string>;
};

const GrapeSContext = createContext<GrapeSThemesProviderValue>();

/**
 * A component that creates the `<GrapeSContext>` with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, GrapeS's default themes are used.
 *
 * If there is no default theme, the first custom theme is used or `GrapeSLightTheme` is used.
 */
export const GrapeS: Component<ParentProps<{
  themes?: Theme[];
  defaultThemeId?: string;
}>> = (props) => {
  const hasCustomThemes = createMemo(() => props.themes && props.themes.length >= 1);

  const currentThemeIdSignal = createSignal<string>(props.defaultThemeId || (
    hasCustomThemes()
      ? props.themes![0].id
      : GrapeSLightTheme.id
  ));

  const themes = hasCustomThemes()
    ? props.themes!
    : [
      GrapeSLightTheme,
      GrapeSDarkTheme
    ];

  const currentTheme = createMemo(() => themes.find(t => t.id === currentThemeIdSignal[0]())!);

  createEffect(() => {
    document.body.style.backgroundColor = currentTheme().grays[0].toRGBA();
  });

  return <GrapeSContext.Provider value={{
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

      '--text-0': currentTheme().textColors[0].toRGBA(),
      '--text-1': currentTheme().textColors[1].toRGBA(),
      '--text-2': currentTheme().textColors[2].toRGBA(),
      '--text-3': currentTheme().textColors[3].toRGBA(),
      '--text-4': currentTheme().textColors[4].toRGBA(),
      '--text-5': currentTheme().textColors[5].toRGBA(),

      '--primary': currentTheme().primary.toRGBA(),
      "--text-primary": currentTheme().textColors.primary.toRGBA(),
      '--lightened-primary': (currentTheme().lightnedPrimary
        || currentTheme().primary.withAlpha(0.32)).toRGBA(),

      '--secondary': currentTheme().secondary.toRGBA(),
      "--text-secondary": currentTheme().textColors.secondary.toRGBA(),
      '--lightened-secondary': (currentTheme().lightnedSecondary
        || currentTheme().secondary.withAlpha(0.32)).toRGBA(),

      '--tertiary': currentTheme().tertiary.toRGBA(),
      "--text-tertiary": currentTheme().textColors.tertiary.toRGBA(),
      '--lightened-tertiary': (currentTheme().lightnedTertiary
        || currentTheme().tertiary.withAlpha(0.32)).toRGBA(),

      '--error': currentTheme().error.toRGBA(),

      '--lightened-primary-2': (currentTheme().lightnedPrimary2
        || currentTheme().primary.withAlpha(0.20)).toRGBA(),
    }}>
      {props.children}
    </div>
  </GrapeSContext.Provider>;
};

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes. 
 *
 * This is supposed to be used inside a `<GrapeS>` component since it is the one whom
 * initializes the global GrapeS context.
 */
export function useTheme(): GrapeSThemesProviderValue | undefined {
  return useContext<GrapeSThemesProviderValue | undefined>(GrapeSContext);
}
