import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  ParentProps,
  Setter,
  useContext
} from 'solid-js';

import { canUseDocument } from '@terraprisma/utils';
import { generateStyleVariablesFrom, Themes } from '@terraprisma/theming';

export type ThemesProviderValue = {
  themes: Themes;
  currentTheme: Accessor<Themes[number]>;

  themeId: Accessor<Themes[number]['id']>;
  setThemeId: Setter<Themes[number]['id']>;
};

const TerraprismaContext = createContext<ThemesProviderValue>();

export const GalobalWrapperID = 'terraprisma-app';

/**
 * A component that creates Terraprisma's global context with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, Terraprisma's default themes are used.
 *
 * @param defaultThemeId The theme that is going to be used by default - defaults to the first theme in {@link themes}
 */
export function setupTerraprisma(
  themes: Themes, // should themes be reactive as well?
  defaultThemeId: Themes[number]['id'] = themes[0].id
) {
  return (props: ParentProps) => {
    const [themeId, setThemeId] =
      createSignal<Themes[number]['id']>(defaultThemeId);

    const currentTheme = createMemo(
      () => themes.find((t) => t.id === themeId())!
    );

    createEffect(() => {
      if (canUseDocument())
        document.body.style.backgroundColor = currentTheme().normal.bg.toRGBA();
    });

    const globalStyles = createMemo(() => {
      const theme = currentTheme();
      const { id, ...objWithStyles } = { ...theme };
      return generateStyleVariablesFrom(objWithStyles);
    });

    return (
      <TerraprismaContext.Provider
        value={{
          themes,
          currentTheme,

          themeId,
          setThemeId
        }}
      >
        <div
          class="leading-[1.5] font-normal box-border text-[var(--text-0)]"
          id={GalobalWrapperID}
          style={globalStyles()}
        >
          {props.children}
        </div>
      </TerraprismaContext.Provider>
    );
  };
}

export function getGlobalWrapper(): HTMLDivElement {
  const div = document.getElementById(GalobalWrapperID);

  if (!div) {
    throw new Error(
      "Could not find Terraprisma's global div by id, did you perhaps modify it or forget to use the ThemeProvider component?"
    );
  }

  return div as HTMLDivElement;
}

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes.
 *
 * This is supposed to be used inside a `<ThemeProvider>` component since it is the one whom
 * initializes the global Terraprisma context.
 */
export function useTheme(): ThemesProviderValue {
  const providerValue = useContext<ThemesProviderValue | undefined>(
    TerraprismaContext
  ) as ThemesProviderValue | undefined;
  if (typeof providerValue === 'undefined') {
    throw new Error(
      'useTheme() error: You can only have a useTheme inside of a Terraprisma context!'
    );
  }

  return providerValue;
}
